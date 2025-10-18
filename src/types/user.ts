import { Link } from "./link";

export interface User {
  id: number;
  username: string;
  name: string | null;
}

export interface UserProfile {
  name: string | null;
  bio: string | null;
}

export interface UserProfileResponse {
  username: string;
  name: string | null;
  bio: string | null;
  links: Link[];
}