from django.test import TestCase
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


class ProjectsTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.username = "client1"
        self.password = "pass1234"
        self.email = "client1@example.com"
        User.objects.create_user(username=self.username, password=self.password, email=self.email)

    def _auth(self):
        r = self.client.post("/api/auth/login/", {"email": self.email, "password": self.password}, format="json")
        token = r.json().get("token")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    def test_create_project_assigns_client(self):
        self._auth()
        payload = {"title": "Test Project", "description": "Do work", "budget": 1000}
        r = self.client.post("/api/projects/", payload, format="json")
        self.assertEqual(r.status_code, 201)
        data = r.json()
        self.assertEqual(data.get("title"), "Test Project")
        # client field should be set
        self.assertIsNotNone(data.get("client"))

    def test_list_projects(self):
        # create one project
        self._auth()
        payload = {"title": "List Project", "description": "List", "budget": 200}
        self.client.post("/api/projects/", payload, format="json")
        r = self.client.get("/api/projects/")
        self.assertEqual(r.status_code, 200)
        data = r.json()
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 1)
