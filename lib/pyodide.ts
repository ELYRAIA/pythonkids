declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loadPyodide: (config?: any) => Promise<any>;
    _pythonInputRequest: (msg: string) => Promise<string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  petAction: (action: string, value: any) => void;
  petGetStats: () => { faim: number; humeur: number; energie: number };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodideSingleton: Promise<any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPyodide(): Promise<any> {
  if (!pyodideSingleton) {
    pyodideSingleton = new Promise((resolve, reject) => {
      if (typeof window === "undefined") return reject("SSR");
      if (typeof window.loadPyodide === "function") {
        window
          .loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/" })
          .then(resolve)
          .catch(reject);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/pyodide.js";
      script.onload = () => {
        window
          .loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.0/full/" })
          .then(resolve)
          .catch(reject);
      };
      script.onerror = () => reject(new Error("Échec du chargement de Pyodide"));
      document.head.appendChild(script);
    });
  }
  return pyodideSingleton;
}
