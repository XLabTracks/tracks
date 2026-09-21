const ASSET = "/verification/assets/team";

export type TeamMember = {
  name: string;
  initials: string;
  photo: string;
  email: string;
  linkedin: string;
};

export const TEAM: TeamMember[] = [
  {
    name: "Marie Veronica Gordi",
    initials: "MG",
    photo: `${ASSET}/veronica-gordi.jpg`,
    email: "vgordi@iu.edu",
    linkedin: "https://www.linkedin.com/in/vgordi/",
  },
  {
    name: "Ava Chen",
    initials: "AC",
    photo: `${ASSET}/ava-chen.jpg`,
    email: "ac5214@princeton.edu",
    linkedin: "https://www.linkedin.com/in/ava-chen-8bb522275",
  },
  {
    name: "Purusha Shirvani",
    initials: "PS",
    photo: `${ASSET}/purusha-shirvani.jpg`,
    email: "shirvani@bu.edu",
    linkedin: "https://www.linkedin.com/in/purushashirvani/",
  },
];
