import { Feedback } from "./feedback";
import { Link } from "./link";

export interface User {
  id: number;
  username: string;
  name: string;
}

export interface UserProfile {
  name: string;
  bio: string;
}

export interface UserProfileResponse extends UserProfile {
  links: Link[];
  feedbacks: Feedback[];
}