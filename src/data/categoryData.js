import {
  FaFilm,
  FaBook,
  FaDragon,
  FaMasksTheater,
} from "react-icons/fa6";

const categoryData = [
  {
    id: 1,
    title: "Movies",
    icon: FaFilm,
    count: "15K+",
    color: "from-red-500 to-orange-500",
  },
  {
    id: 2,
    title: "Books",
    icon: FaBook,
    count: "5K+",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    title: "Manga",
    icon: FaDragon,
    count: "3K+",
    color: "from-pink-500 to-purple-500",
  },
  {
    id: 4,
    title: "Comics",
    icon: FaMasksTheater,
    count: "1K+",
    color: "from-green-500 to-emerald-500",
  },
];

export default categoryData;