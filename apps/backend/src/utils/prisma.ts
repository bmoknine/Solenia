/** Violation de contrainte d’unicité Prisma (doublon). */
export function isPrismaUniqueViolation(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: string }).code === 'P2002'
  );
}

/**
 * Exécute une opération Prisma et ignore silencieusement les violations de contrainte d’unicité (P2002),
 * utile en cas de course entre insertions sur les tables de liaison.
 */
export async function ignoreUniqueViolation<T>(promise: Promise<T>): Promise<T | undefined> {
  try {
    return await promise;
  } catch (err: unknown) {
    if (isPrismaUniqueViolation(err)) return undefined;
    throw err;
  }
}
