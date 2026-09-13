import apiCall from "./api";

export interface CreateProposalData {
  project: number;
  cover_letter: string;
  proposed_budget: number;
  delivery_time: string;
}

export interface Proposal {
  id: number;
  project: number;
  project_title: string;
  freelancer: number;
  freelancer_name: string;
  cover_letter: string;
  proposed_budget: string;
  delivery_time: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  created_at: string;
  updated_at: string;
}

export const proposalService = {
  // Freelancer: create a proposal
  createProposal: async (
    data: CreateProposalData
  ): Promise<Proposal> => {
    return apiCall("/projects/proposals/", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Client/Freelancer: get accessible proposals
  getProposals: async (): Promise<Proposal[]> => {
    return apiCall("/projects/proposals/");
  },

  // Get one proposal
  getProposalById: async (
    proposalId: number
  ): Promise<Proposal> => {
    return apiCall(`/projects/proposals/${proposalId}/`);
  },

  // Client: accept a proposal
  acceptProposal: async (
    proposalId: number
  ): Promise<Proposal> => {
    return apiCall(`/projects/proposals/${proposalId}/accept/`, {
      method: "POST",
    });
  },

  // Client: reject a proposal
  rejectProposal: async (
    proposalId: number
  ): Promise<Proposal> => {
    return apiCall(`/projects/proposals/${proposalId}/reject/`, {
      method: "POST",
    });
  },
};

export default proposalService
