// mockKolData.ts
// Mock data for KOL (Key Opinion Leaders) in dermatology/vitiligo research

export interface KOL {
  id: string;
  name: string;
  affiliation: string;
  country: string;
  city?: string;
  expertiseArea: string;
  publicationsCount: number;
  hIndex: number;
  citations: number;
}

export const mockKolData: KOL[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    affiliation: "Harvard Medical School",
    country: "United States",
    city: "Boston",
    expertiseArea: "Dermatology",
    publicationsCount: 127,
    hIndex: 42,
    citations: 5432
  },
  {
    id: "2",
    name: "Prof. Jean-Michel Dubois",
    affiliation: "Université Paris-Saclay",
    country: "France",
    city: "Paris",
    expertiseArea: "Autoimmune Diseases",
    publicationsCount: 89,
    hIndex: 38,
    citations: 4123
  },
  {
    id: "3",
    name: "Dr. Yuki Tanaka",
    affiliation: "Tokyo University Hospital",
    country: "Japan",
    city: "Tokyo",
    expertiseArea: "Pigmentation Disorders",
    publicationsCount: 156,
    hIndex: 51,
    citations: 7234
  },
  {
    id: "4",
    name: "Prof. Maria Garcia",
    affiliation: "Universidad Complutense de Madrid",
    country: "Spain",
    city: "Madrid",
    expertiseArea: "Dermatology",
    publicationsCount: 93,
    hIndex: 35,
    citations: 3876
  },
  {
    id: "5",
    name: "Dr. Ahmed El-Sayed",
    affiliation: "Cairo University",
    country: "Egypt",
    city: "Cairo",
    expertiseArea: "Vitiligo Research",
    publicationsCount: 67,
    hIndex: 28,
    citations: 2341
  },
  {
    id: "6",
    name: "Prof. Emma Schmidt",
    affiliation: "Charité - Universitätsmedizin Berlin",
    country: "Germany",
    city: "Berlin",
    expertiseArea: "Autoimmune Diseases",
    publicationsCount: 142,
    hIndex: 47,
    citations: 6543
  },
  {
    id: "7",
    name: "Dr. Raj Patel",
    affiliation: "All India Institute of Medical Sciences",
    country: "India",
    city: "New Delhi",
    expertiseArea: "Dermatology",
    publicationsCount: 78,
    hIndex: 31,
    citations: 2987
  },
  {
    id: "8",
    name: "Prof. Ana Silva",
    affiliation: "Universidade de São Paulo",
    country: "Brazil",
    city: "São Paulo",
    expertiseArea: "Skin Immunology",
    publicationsCount: 104,
    hIndex: 39,
    citations: 4567
  },
  {
    id: "9",
    name: "Dr. Michael Chen",
    affiliation: "Stanford University Medical Center",
    country: "United States",
    city: "Stanford",
    expertiseArea: "Pigmentation Disorders",
    publicationsCount: 118,
    hIndex: 44,
    citations: 5789
  },
  {
    id: "10",
    name: "Prof. Sophie Martin",
    affiliation: "University of Oxford",
    country: "United Kingdom",
    city: "Oxford",
    expertiseArea: "Dermatology",
    publicationsCount: 134,
    hIndex: 49,
    citations: 6234
  },
  {
    id: "11",
    name: "Dr. Li Wei",
    affiliation: "Peking University Hospital",
    country: "China",
    city: "Beijing",
    expertiseArea: "Vitiligo Research",
    publicationsCount: 95,
    hIndex: 36,
    citations: 4012
  },
  {
    id: "12",
    name: "Prof. David Kim",
    affiliation: "Seoul National University",
    country: "South Korea",
    city: "Seoul",
    expertiseArea: "Autoimmune Diseases",
    publicationsCount: 86,
    hIndex: 33,
    citations: 3456
  },
  {
    id: "13",
    name: "Dr. Isabella Rossi",
    affiliation: "Università degli Studi di Milano",
    country: "Italy",
    city: "Milan",
    expertiseArea: "Skin Immunology",
    publicationsCount: 72,
    hIndex: 29,
    citations: 2654
  },
  {
    id: "14",
    name: "Prof. Henrik Larsson",
    affiliation: "Karolinska Institutet",
    country: "Sweden",
    city: "Stockholm",
    expertiseArea: "Dermatology",
    publicationsCount: 109,
    hIndex: 41,
    citations: 4876
  },
  {
    id: "15",
    name: "Dr. Patricia Williams",
    affiliation: "Johns Hopkins University",
    country: "United States",
    city: "Baltimore",
    expertiseArea: "Pigmentation Disorders",
    publicationsCount: 121,
    hIndex: 45,
    citations: 5921
  },
  {
    id: "16",
    name: "Prof. Mohammed Hassan",
    affiliation: "King Saud University",
    country: "Saudi Arabia",
    city: "Riyadh",
    expertiseArea: "Dermatology",
    publicationsCount: 63,
    hIndex: 25,
    citations: 2103
  },
  {
    id: "17",
    name: "Dr. Elena Popov",
    affiliation: "Moscow State University",
    country: "Russia",
    city: "Moscow",
    expertiseArea: "Vitiligo Research",
    publicationsCount: 81,
    hIndex: 32,
    citations: 3234
  },
  {
    id: "18",
    name: "Prof. Robert Brown",
    affiliation: "University of Melbourne",
    country: "Australia",
    city: "Melbourne",
    expertiseArea: "Autoimmune Diseases",
    publicationsCount: 97,
    hIndex: 37,
    citations: 4321
  },
  {
    id: "19",
    name: "Dr. Fatima Al-Rashid",
    affiliation: "American University of Beirut",
    country: "Lebanon",
    city: "Beirut",
    expertiseArea: "Dermatology",
    publicationsCount: 54,
    hIndex: 22,
    citations: 1876
  },
  {
    id: "20",
    name: "Prof. Lars Nielsen",
    affiliation: "University of Copenhagen",
    country: "Denmark",
    city: "Copenhagen",
    expertiseArea: "Skin Immunology",
    publicationsCount: 88,
    hIndex: 34,
    citations: 3678
  },
  {
    id: "21",
    name: "Dr. Priya Sharma",
    affiliation: "National University of Singapore",
    country: "Singapore",
    city: "Singapore",
    expertiseArea: "Pigmentation Disorders",
    publicationsCount: 76,
    hIndex: 30,
    citations: 2987
  },
  {
    id: "22",
    name: "Prof. Carlos Mendez",
    affiliation: "Universidad Nacional Autónoma de México",
    country: "Mexico",
    city: "Mexico City",
    expertiseArea: "Dermatology",
    publicationsCount: 69,
    hIndex: 27,
    citations: 2456
  },
  {
    id: "23",
    name: "Dr. Anna Kowalski",
    affiliation: "Jagiellonian University",
    country: "Poland",
    city: "Krakow",
    expertiseArea: "Vitiligo Research",
    publicationsCount: 58,
    hIndex: 24,
    citations: 2012
  },
  {
    id: "24",
    name: "Prof. James Taylor",
    affiliation: "University of Toronto",
    country: "Canada",
    city: "Toronto",
    expertiseArea: "Autoimmune Diseases",
    publicationsCount: 112,
    hIndex: 43,
    citations: 5234
  },
  {
    id: "25",
    name: "Dr. Mei Lin",
    affiliation: "National Taiwan University",
    country: "Taiwan",
    city: "Taipei",
    expertiseArea: "Dermatology",
    publicationsCount: 84,
    hIndex: 31,
    citations: 3123
  },
  {
    id: "26",
    name: "Prof. Thomas Müller",
    affiliation: "Ludwig Maximilian University of Munich",
    country: "Germany",
    city: "Munich",
    expertiseArea: "Skin Immunology",
    publicationsCount: 103,
    hIndex: 40,
    citations: 4678
  },
  {
    id: "27",
    name: "Dr. Sofia Andersson",
    affiliation: "Lund University",
    country: "Sweden",
    city: "Lund",
    expertiseArea: "Pigmentation Disorders",
    publicationsCount: 71,
    hIndex: 28,
    citations: 2765
  },
  {
    id: "28",
    name: "Prof. Hiroshi Nakamura",
    affiliation: "Kyoto University",
    country: "Japan",
    city: "Kyoto",
    expertiseArea: "Dermatology",
    publicationsCount: 126,
    hIndex: 46,
    citations: 5876
  },
  {
    id: "29",
    name: "Dr. Rachel Cohen",
    affiliation: "Tel Aviv University",
    country: "Israel",
    city: "Tel Aviv",
    expertiseArea: "Vitiligo Research",
    publicationsCount: 79,
    hIndex: 30,
    citations: 3012
  },
  {
    id: "30",
    name: "Prof. Antonio Fernandez",
    affiliation: "University of Barcelona",
    country: "Spain",
    city: "Barcelona",
    expertiseArea: "Autoimmune Diseases",
    publicationsCount: 91,
    hIndex: 35,
    citations: 3987
  },
  {
    id: "31",
    name: "Dr. Lisa Anderson",
    affiliation: "University of California, Los Angeles",
    country: "United States",
    city: "Los Angeles",
    expertiseArea: "Dermatology",
    publicationsCount: 108,
    hIndex: 41,
    citations: 4987
  },
  {
    id: "32",
    name: "Prof. Pierre Lefebvre",
    affiliation: "Université de Montréal",
    country: "Canada",
    city: "Montreal",
    expertiseArea: "Skin Immunology",
    publicationsCount: 87,
    hIndex: 33,
    citations: 3456
  },
  {
    id: "33",
    name: "Dr. Olivia Martinez",
    affiliation: "University of Buenos Aires",
    country: "Argentina",
    city: "Buenos Aires",
    expertiseArea: "Pigmentation Disorders",
    publicationsCount: 65,
    hIndex: 26,
    citations: 2345
  },
  {
    id: "34",
    name: "Prof. Jan van der Berg",
    affiliation: "University of Amsterdam",
    country: "Netherlands",
    city: "Amsterdam",
    expertiseArea: "Dermatology",
    publicationsCount: 99,
    hIndex: 38,
    citations: 4321
  },
  {
    id: "35",
    name: "Dr. Sunita Kapoor",
    affiliation: "Postgraduate Institute of Medical Education and Research",
    country: "India",
    city: "Chandigarh",
    expertiseArea: "Vitiligo Research",
    publicationsCount: 73,
    hIndex: 29,
    citations: 2876
  },
  {
    id: "36",
    name: "Prof. Martin O'Connor",
    affiliation: "Trinity College Dublin",
    country: "Ireland",
    city: "Dublin",
    expertiseArea: "Autoimmune Diseases",
    publicationsCount: 82,
    hIndex: 32,
    citations: 3234
  },
  {
    id: "37",
    name: "Dr. Natalia Ivanova",
    affiliation: "Saint Petersburg State University",
    country: "Russia",
    city: "Saint Petersburg",
    expertiseArea: "Dermatology",
    publicationsCount: 68,
    hIndex: 27,
    citations: 2543
  },
  {
    id: "38",
    name: "Prof. George Papadopoulos",
    affiliation: "National and Kapodistrian University of Athens",
    country: "Greece",
    city: "Athens",
    expertiseArea: "Skin Immunology",
    publicationsCount: 75,
    hIndex: 30,
    citations: 2987
  },
  {
    id: "39",
    name: "Dr. Jennifer Lee",
    affiliation: "University of Washington",
    country: "United States",
    city: "Seattle",
    expertiseArea: "Pigmentation Disorders",
    publicationsCount: 115,
    hIndex: 43,
    citations: 5321
  },
  {
    id: "40",
    name: "Prof. Klaus Weber",
    affiliation: "University of Vienna",
    country: "Austria",
    city: "Vienna",
    expertiseArea: "Dermatology",
    publicationsCount: 94,
    hIndex: 36,
    citations: 4012
  },
  {
    id: "41",
    name: "Dr. Amira Osman",
    affiliation: "University of Cape Town",
    country: "South Africa",
    city: "Cape Town",
    expertiseArea: "Vitiligo Research",
    publicationsCount: 61,
    hIndex: 24,
    citations: 2123
  },
  {
    id: "42",
    name: "Prof. Laurent Blanc",
    affiliation: "Université Libre de Bruxelles",
    country: "Belgium",
    city: "Brussels",
    expertiseArea: "Autoimmune Diseases",
    publicationsCount: 85,
    hIndex: 33,
    citations: 3456
  },
  {
    id: "43",
    name: "Dr. Karen Nielsen",
    affiliation: "Aarhus University",
    country: "Denmark",
    city: "Aarhus",
    expertiseArea: "Dermatology",
    publicationsCount: 77,
    hIndex: 30,
    citations: 2876
  },
  {
    id: "44",
    name: "Prof. Takeshi Yamamoto",
    affiliation: "Osaka University",
    country: "Japan",
    city: "Osaka",
    expertiseArea: "Skin Immunology",
    publicationsCount: 102,
    hIndex: 39,
    citations: 4567
  },
  {
    id: "45",
    name: "Dr. Laura Fernandez",
    affiliation: "University of Chile",
    country: "Chile",
    city: "Santiago",
    expertiseArea: "Pigmentation Disorders",
    publicationsCount: 66,
    hIndex: 26,
    citations: 2345
  },
  {
    id: "46",
    name: "Prof. Andrew Wilson",
    affiliation: "University of Edinburgh",
    country: "United Kingdom",
    city: "Edinburgh",
    expertiseArea: "Dermatology",
    publicationsCount: 119,
    hIndex: 44,
    citations: 5432
  },
  {
    id: "47",
    name: "Dr. Nadia Khalil",
    affiliation: "American University in Cairo",
    country: "Egypt",
    city: "Cairo",
    expertiseArea: "Vitiligo Research",
    publicationsCount: 59,
    hIndex: 23,
    citations: 1987
  },
  {
    id: "48",
    name: "Prof. Hans Schneider",
    affiliation: "University of Zurich",
    country: "Switzerland",
    city: "Zurich",
    expertiseArea: "Autoimmune Diseases",
    publicationsCount: 106,
    hIndex: 40,
    citations: 4765
  },
  {
    id: "49",
    name: "Dr. Ming Zhang",
    affiliation: "Fudan University",
    country: "China",
    city: "Shanghai",
    expertiseArea: "Dermatology",
    publicationsCount: 89,
    hIndex: 34,
    citations: 3678
  },
  {
    id: "50",
    name: "Prof. Sandra Oliveira",
    affiliation: "Universidade de Coimbra",
    country: "Portugal",
    city: "Coimbra",
    expertiseArea: "Skin Immunology",
    publicationsCount: 80,
    hIndex: 31,
    citations: 3123
  }
];

export default mockKolData;
