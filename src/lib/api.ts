const API_BASE = 'http://localhost:3001/api';

export const api = {
  // Students
  async registerStudent(data: any) {
    const res = await fetch(`${API_BASE}/students/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async loginStudent(email: string, password: string) {
    const res = await fetch(`${API_BASE}/students/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  async getStudents() {
    const res = await fetch(`${API_BASE}/students`);
    return res.json();
  },

  async getStudent(id: number) {
    const res = await fetch(`${API_BASE}/students/${id}`);
    return res.json();
  },

  // TPO
  async loginTPO(email: string, password: string) {
    const res = await fetch(`${API_BASE}/tpo/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  // Drives
  async getDrives() {
    const res = await fetch(`${API_BASE}/drives`);
    return res.json();
  },

  async createDrive(data: any) {
    const res = await fetch(`${API_BASE}/drives`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Applications
  async applyToDrive(studentId: number, driveId: number) {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, driveId })
    });
    return res.json();
  },

  async getStudentApplications(studentId: number) {
    const res = await fetch(`${API_BASE}/students/${studentId}/applications`);
    return res.json();
  },

  async getApplications() {
    const res = await fetch(`${API_BASE}/applications`);
    return res.json();
  },

  // Companies
  async getCompanies() {
    const res = await fetch(`${API_BASE}/companies`);
    return res.json();
  },

  async createCompany(data: any) {
    const res = await fetch(`${API_BASE}/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    return res.json();
  }
};
