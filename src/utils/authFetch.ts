export async function authFetch<T = any>(url: string, options: RequestInit = {}): Promise<T | null> {
  const token = localStorage.getItem("token");

  const isFormData = options.body instanceof FormData;

  const defaultHeaders: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const res = await fetch(url, config);

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Error en la solicitud");
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
    return null;
  }

  return res.json() as Promise<T>;
}
