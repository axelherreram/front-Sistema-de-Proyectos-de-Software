// types.ts
export interface Module {
    id: number;
    name: string;
    description: string;
    projectId: number;
    phaseId: number;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Project {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    modules: Module[];
  }
  