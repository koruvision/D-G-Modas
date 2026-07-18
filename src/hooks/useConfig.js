import { useEffect, useState } from "react";
import { loadConfig } from "../services/api.js";

export function useConfig() {
  const [cfg, setCfg] = useState(null);
  useEffect(() => {
    loadConfig().then(setCfg).catch(console.error);
  }, []);
  return cfg;
}
