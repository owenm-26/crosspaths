import { useState } from "react";

export default function useAuth() {
  // Replace with real auth logic later
  const [user, setUser] = useState(null);

  return { user, setUser };
}
