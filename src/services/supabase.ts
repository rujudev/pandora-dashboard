import { supabaseClient } from "../db/config";

export async function insertRows<T extends Record<string, any>>(
    table: string,
    rows: T[]
): Promise<T[]> {
    if (rows.length === 0) return [];

    const inserts = rows.map((r) => ({ ...r, created_at: new Date().toISOString() }))

    const { data, error } = await supabaseClient.from(table).insert(inserts).select('*');

    if (error) throw error;

    return data;
}

export async function updateRows<T extends Record<string, any>>(
    table: string,
    rows: T[],
    pk: keyof T
) {
    const toUpdate = rows.filter(r => r[pk] !== null);

    if (toUpdate.length === 0) return;

    const updates = toUpdate.map(r => ({ ...r, updated_at: new Date().toISOString() }))

    const { error } = await supabaseClient.from(table).upsert(updates);

    if (error) throw error;
}