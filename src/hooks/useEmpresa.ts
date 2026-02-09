import { useEffect, useState } from "react";
import { api } from "../config/api";
import type { Empresa } from "../types/empresa";

export function useEmpresa() {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchEmpresa() {
    try {
      setLoading(true);
      const { data } = await api.get<Empresa | null>("/empresa");
      setEmpresa(data && Object.keys(data || {}).length ? data : null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmpresa();
  }, []);

  return { empresa, loading, refresh: fetchEmpresa };
}
