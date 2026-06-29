import { createUser, createDemoUser } from '@/domain/user/model';

let currentUser = null;
let users = [];

function notifyListeners() {
  listeners.forEach((listener) => listener(currentUser));
}

const listeners = [];

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  };
}

export function getCurrentUser() {
  return currentUser;
}

export function getUsers() {
  return [...users];
}

export function initDemoSession() {
  users = [createDemoUser()];
  currentUser = users[0];
  notifyListeners();
  return currentUser;
}

export function restoreDemo() {
  currentUser = users[0];
  notifyListeners();
  return currentUser;
}

export function login(email) {
  const user = users.find((u) => u.email === email);
  if (!user) {
    throw new Error('Usuário não encontrado');
  }
  currentUser = user;
  notifyListeners();
  return currentUser;
}

export function logout() {
  currentUser = null;
  notifyListeners();
  return null;
}

export function register(userData) {
  const existingUser = users.find((u) => u.email === userData.email);
  if (existingUser) {
    throw new Error('Email já cadastrado');
  }

  const newUser = createUser({
    ...userData,
    id: userData.id || `user-${Date.now()}`,
    isDemo: false,
    isAdmin: false,
    status: 'ativo',
  });

  users.push(newUser);
  currentUser = newUser;
  notifyListeners();
  return newUser;
}

export function addUser(userData) {
  const user = createUser(userData);
  users.push(user);
  return user;
}

export function updateUser(userId, data) {
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    return null;
  }

  users[index] = {
    ...users[index],
    ...data,
    id: userId,
    updatedAt: new Date().toISOString(),
  };

  if (currentUser && currentUser.id === userId) {
    currentUser = users[index];
    notifyListeners();
  }

  return users[index];
}

export function getUserById(userId) {
  return users.find((u) => u.id === userId) || null;
}

export function getUserByEmail(email) {
  return users.find((u) => u.email === email) || null;
}

export function resetDemoSession() {
  return initDemoSession();
}