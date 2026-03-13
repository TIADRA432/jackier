import { db } from '../config/firebase';

// --- MOCK DATABASE ---
let mockCategories: any[] = [
  { id: 'cat1', name: 'Entrées', description: 'Pour commencer', order: 1, active: true },
  { id: 'cat2', name: 'Plats principaux', description: 'Le cœur du repas', order: 2, active: true },
  { id: 'cat3', name: 'Desserts', description: 'Une touche sucrée', order: 3, active: true }
];
let mockMenuItems: any[] = [
  { id: 'item1', categoryId: 'cat1', name: 'Foie Gras Maison', shortDescription: 'Chutney de figues', price: 24, imageUrl: '', isFeatured: true, displayOrder: 1, active: true },
  { id: 'item2', categoryId: 'cat2', name: 'Filet de Bœuf Rossini', shortDescription: 'Pommes Anna, sauce truffe', price: 45, imageUrl: '', isFeatured: true, displayOrder: 1, active: true }
];
let mockWines: any[] = [
  { id: 'wine1', name: 'Château Margaux 2018', origin: 'Bordeaux', grape: 'Cabernet Sauvignon', year: 2018, description: 'Un grand cru exceptionnel', priceBottle: 800, priceGlass: 120, imageUrl: '', displayOrder: 1, active: true }
];

const generateId = () => Math.random().toString(36).substring(2, 15);

// --- HELPER TO GET DATA ---
export const getCollection = async (collectionName: string) => {
  if (db) {
    const snapshot = await db.collection(collectionName).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    if (collectionName === 'menuCategories') return mockCategories;
    if (collectionName === 'menuItems') return mockMenuItems;
    if (collectionName === 'wineItems') return mockWines;
    return [];
  }
};

export const addDoc = async (collectionName: string, data: any) => {
  if (db) {
    const docRef = await db.collection(collectionName).add(data);
    return { id: docRef.id, ...data };
  } else {
    const newDoc = { id: generateId(), ...data };
    if (collectionName === 'menuCategories') mockCategories.push(newDoc);
    if (collectionName === 'menuItems') mockMenuItems.push(newDoc);
    if (collectionName === 'wineItems') mockWines.push(newDoc);
    return newDoc;
  }
};

export const updateDoc = async (collectionName: string, id: string, data: any) => {
  if (db) {
    await db.collection(collectionName).doc(id).update(data);
    return { id, ...data };
  } else {
    let list: any[] = [];
    if (collectionName === 'menuCategories') list = mockCategories;
    if (collectionName === 'menuItems') list = mockMenuItems;
    if (collectionName === 'wineItems') list = mockWines;
    
    const index = list.findIndex(item => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...data };
      return list[index];
    }
    throw new Error('Not found');
  }
};

export const deleteDoc = async (collectionName: string, id: string) => {
  if (db) {
    await db.collection(collectionName).doc(id).delete();
  } else {
    if (collectionName === 'menuCategories') mockCategories = mockCategories.filter(i => i.id !== id);
    if (collectionName === 'menuItems') mockMenuItems = mockMenuItems.filter(i => i.id !== id);
    if (collectionName === 'wineItems') mockWines = mockWines.filter(i => i.id !== id);
  }
};
