declare module "jest-axe" {
  export type AxeViolation = {
    impact: string | null;
    id: string;
    description: string;
  };
  export function axe(
    container: Element,
  ): Promise<{ violations: AxeViolation[] }>;
}
