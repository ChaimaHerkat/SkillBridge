from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

User = get_user_model()


class MessagingTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        # create two users
        self.u1 = User.objects.create_user(
            username="u1", password="pw1", email="u1@example.com"
        )
        self.u2 = User.objects.create_user(
            username="u2", password="pw2", email="u2@example.com"
        )

    def _auth_as(self, username, password):
        # Login uses email in this project
        user = User.objects.get(username=username)
        r = self.client.post(
            "/api/auth/login/",
            {"email": user.email, "password": password},
            format="json",
        )
        token = r.json().get("token")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_send_and_get_conversation(self):
        # auth as u1 and send message to u2
        self._auth_as("u1", "pw1")
        send = self.client.post(
            "/api/messages/",
            {"recipient": self.u2.id, "content": "Hello"},
            format="json",
        )
        self.assertEqual(send.status_code, 201)
        data = send.json()
        self.assertEqual(data.get("recipient"), self.u2.id)

        # get conversation as u1 with user u2
        conv = self.client.get(f"/api/messages/?user={self.u2.id}")
        self.assertEqual(conv.status_code, 200)
        messages = conv.json()
        self.assertIsInstance(messages, list)
        self.assertGreaterEqual(len(messages), 1)
