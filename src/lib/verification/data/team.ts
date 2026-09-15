const ASSET = "/verification/assets/team";

const BIO_PLACEHOLDER =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.";

export type TeamMember = {
  name: string;
  initials: string;
  role: string;
  bio: string;
  photo: string;
  email: string;
  linkedin: string;
};

export const TEAM: TeamMember[] = [
  {
    name: "Marie Veronica Gordi",
    initials: "MG",
    role: "Role not supplied yet",
    bio: BIO_PLACEHOLDER,
    photo: `${ASSET}/veronica-gordi.jpg`,
    email: "vgordi@iu.edu",
    linkedin: "https://www.linkedin.com/in/vgordi/",
  },
  {
    name: "Ava Chen",
    initials: "AC",
    role: "Role not supplied yet",
    bio: BIO_PLACEHOLDER,
    photo: `${ASSET}/ava-chen.jpg`,
    email: "ac5214@princeton.edu",
    linkedin: "https://www.linkedin.com/in/ava-chen-8bb522275",
  },
  {
    name: "Purusha Shirvani",
    initials: "PS",
    role: "Role not supplied yet",
    bio: BIO_PLACEHOLDER,
    photo: `${ASSET}/purusha-shirvani.jpg`,
    email: "shirvani@bu.edu",
    linkedin: "https://www.linkedin.com/in/purushashirvani/",
  },
];
