export type Tool = {
  id: number;
  name: string;
  discipline: 'electrical' | 'plumbing' | 'framing';
  onlyAvailableFrom: string;
};

// Deliberately boring. The list is not the lesson.
export const TOOLS: Tool[] = [
  { id: 1, name: 'Insulated screwdriver set', discipline: 'electrical', onlyAvailableFrom: 'Bay 2' },
  { id: 2, name: 'Multimeter', discipline: 'electrical', onlyAvailableFrom: 'Bay 2' },
  { id: 3, name: 'Conduit bender', discipline: 'electrical', onlyAvailableFrom: 'Yard' },
  { id: 4, name: 'Pipe wrench, 24"', discipline: 'plumbing', onlyAvailableFrom: 'Bay 1' },
  { id: 5, name: 'Drain auger', discipline: 'plumbing', onlyAvailableFrom: 'Bay 1' },
  { id: 6, name: 'Propane torch', discipline: 'plumbing', onlyAvailableFrom: 'Yard' },
  { id: 7, name: 'Framing nailer', discipline: 'framing', onlyAvailableFrom: 'Bay 3' },
  { id: 8, name: 'Reciprocating saw', discipline: 'framing', onlyAvailableFrom: 'Bay 3' },
  { id: 9, name: 'Laser level', discipline: 'framing', onlyAvailableFrom: 'Bay 1' },
];
