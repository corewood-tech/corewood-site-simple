const DB_NAME = 'tetra-cache';
const STORE_NAME = 'queries';
const DB_VERSION = 1;
const TTL_MS = 3_600_000; // 1 hour

function openDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, DB_VERSION);
		req.onupgradeneeded = () => {
			req.result.createObjectStore(STORE_NAME);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}

async function sha256(text: string): Promise<string> {
	const data = new TextEncoder().encode(text);
	const hash = await crypto.subtle.digest('SHA-256', data);
	return Array.from(new Uint8Array(hash))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

export async function getCached(query: string): Promise<string | null> {
	try {
		const key = await sha256(query);
		const db = await openDB();
		return new Promise((resolve) => {
			const tx = db.transaction(STORE_NAME, 'readonly');
			const req = tx.objectStore(STORE_NAME).get(key);
			req.onsuccess = () => {
				const entry = req.result;
				if (!entry || Date.now() - entry.timestamp > TTL_MS) {
					resolve(null);
				} else {
					resolve(entry.data);
				}
			};
			req.onerror = () => resolve(null);
		});
	} catch {
		return null;
	}
}

export async function setCached(query: string, data: string): Promise<void> {
	try {
		const key = await sha256(query);
		const db = await openDB();
		const tx = db.transaction(STORE_NAME, 'readwrite');
		tx.objectStore(STORE_NAME).put({ data, timestamp: Date.now() }, key);
	} catch {
		// Cache write failure is non-fatal
	}
}

export async function clearCache(): Promise<void> {
	try {
		const db = await openDB();
		const tx = db.transaction(STORE_NAME, 'readwrite');
		tx.objectStore(STORE_NAME).clear();
	} catch {
		// Non-fatal
	}
}
