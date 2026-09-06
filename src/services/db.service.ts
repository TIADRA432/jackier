import { supabase } from '../config/supabase';

const TABLES: Record<string, string> = {
  menuCategories: 'menu_categories',
  menuItems: 'menu_items',
  wineItems: 'wine_items',
  cateringEvents: 'catering_events',
  schoolPrograms: 'school_programs',
  financeReports: 'finance_reports',
  reservations: 'reservations',
  expenses: 'expenses',
  logs: 'logs',
  settings: 'settings',
  users: 'profiles'
};

const FIELD_MAP: Record<string, Record<string, string>> = {
  menuItems: { categoryId: 'category_id', shortDescription: 'short_description', imageUrl: 'image_url', isFeatured: 'is_featured', displayOrder: 'display_order' },
  wineItems: { priceBottle: 'price_bottle', priceGlass: 'price_glass', imageUrl: 'image_url', displayOrder: 'display_order' },
  menuCategories: { order: 'order' }
};

const tableFor = (collectionName: string) => TABLES[collectionName] || collectionName;

const toDb = (collectionName: string, input: any) => {
  const map = FIELD_MAP[collectionName] || {};
  const output: any = {};
  for (const [key, value] of Object.entries(input || {})) {
    if (key === 'id' || value === undefined) continue;
    const dbKey = map[key] || key.replace(/[A-Z]/g, m => `_${m.toLowerCase()}`);
    output[dbKey] = value;
  }
  return output;
};

const fromDb = (collectionName: string, row: any) => {
  if (!row) return row;
  const reverse = FIELD_MAP[collectionName] || {};
  const output: any = { ...row };
  for (const [camel, snake] of Object.entries(reverse)) {
    if (snake in row) {
      output[camel] = row[snake];
      delete output[snake];
    }
  }
  for (const [key, value] of Object.entries({ ...output })) {
    if (key.includes('_')) {
      const camel = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      if (!(camel in output)) {
        output[camel] = value;
        delete output[key];
      }
    }
  }
  return output;
};

const flattenJsonTable = (collectionName: string, row: any) => {
  if (row?.data && typeof row.data === 'object' && !Array.isArray(row.data)) {
    return { ...fromDb(collectionName, row), ...row.data, id: row.id };
  }
  return fromDb(collectionName, row);
};

const prepareInsert = (collectionName: string, data: any) => {
  const mapped = toDb(collectionName, data);
  const jsonTables = ['reservations', 'cateringEvents', 'schoolPrograms', 'settings', 'expenses'];
  if (jsonTables.includes(collectionName)) {
    const dataField = { ...data };
    delete dataField.id;
    return {
      ...(collectionName === 'expenses' && data.amount !== undefined ? { amount: data.amount } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.date !== undefined ? { date: data.date } : {}),
      ...(collectionName === 'settings' && data.id ? { id: data.id } : {}),
      data: dataField
    };
  }
  return mapped;
};

export const getCollection = async (collectionName: string) => {
  const { data, error } = await supabase.from(tableFor(collectionName)).select('*');
  if (error) throw error;
  return (data || []).map(row => flattenJsonTable(collectionName, row));
};

export const addDoc = async (collectionName: string, input: any) => {
  const { data, error } = await supabase.from(tableFor(collectionName)).insert(prepareInsert(collectionName, input)).select('*').single();
  if (error) throw error;
  return flattenJsonTable(collectionName, data);
};

export const updateDoc = async (collectionName: string, id: string, input: any) => {
  const payload = prepareInsert(collectionName, input);
  const { data, error } = await supabase.from(tableFor(collectionName)).update(payload).eq('id', id).select('*').single();
  if (error) throw error;
  return flattenJsonTable(collectionName, data);
};

export const deleteDoc = async (collectionName: string, id: string) => {
  const { error } = await supabase.from(tableFor(collectionName)).delete().eq('id', id);
  if (error) throw error;
};

export const getProfile = async (uid: string) => {
  const { data, error } = await supabase.from('profiles').select('id,email,role').eq('id', uid).maybeSingle();
  if (error) throw error;
  return data;
};
