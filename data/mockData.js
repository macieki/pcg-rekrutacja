export const programmes = [
  {
    id: 1,
    name: 'Informatyka',
    level: 'Licencjat',
    mode: 'Stacjonarne',
    language: 'Polski',
    recruitmentStatus: 'open',
    editions: 3,
    recruitmentDates: {
      start: '2025-06-01',
      end: '2025-07-31',
      resultsDate: '2025-08-15'
    },
    requiredSubjects: ['Matematyka (poziom rozszerzony)', 'Fizyka lub informatyka'],
    tuitionFee: '0 PLN (finansowane przez państwo)',
    recruitmentFee: '85 PLN',
    seatsLimit: 120,
    description: 'Kompleksowy program obejmujący algorytmy, struktury danych, inżynierię oprogramowania, sztuczną inteligencję i nowoczesne paradygmaty programowania. Absolwenci są przygotowani do kariery w tworzeniu oprogramowania, analizie danych i doradztwie IT.'
  },
  {
    id: 2,
    name: 'Informatyka stosowana',
    level: 'Magisterskie',
    mode: 'Stacjonarne',
    language: 'Angielski',
    recruitmentStatus: 'open',
    editions: 2,
    recruitmentDates: {
      start: '2025-06-01',
      end: '2025-08-15',
      resultsDate: '2025-08-30'
    },
    requiredSubjects: ['Dyplom licencjata w zakresie informatyki lub pokrewnej dziedziny'],
    additionalExams: {
      required: true,
      exams: [
        {
          name: 'Egzamin z algorytmów i struktur danych',
          description: 'Pisemny egzamin sprawdzający zaawansowaną wiedzę z algorytmów, złożoności obliczeniowej i struktur danych',
          duration: '120 minut',
          date: '2025-09-05'
        },
        {
          name: 'Rozmowa kwalifikacyjna',
          description: 'Rozmowa z komisją rekrutacyjną oceniająca motywację i przygotowanie do studiów magisterskich',
          duration: '30 minut',
          date: '2025-09-10'
        }
      ],
      examLocation: 'Wydział Informatyki, budynek A, sala 201',
      registrationDeadline: '2025-09-01'
    },
    tuitionFee: '4000 PLN/rok',
    recruitmentFee: '85 PLN',
    seatsLimit: 60,
    description: 'Zaawansowany program magisterski skupiony na systemach rozproszonych, uczeniu maszynowym, cyberbezpieczeństwie i przetwarzaniu w chmurze. Prowadzony całkowicie w języku angielskim z międzynarodową kadrą. Uwaga: Wymaga zdania dodatkowych egzaminów kwalifikacyjnych.'
  },
  {
    id: 3,
    name: 'Nauka o danych',
    level: 'Licencjat',
    mode: 'Stacjonarne',
    language: 'Polski',
    recruitmentStatus: 'open',
    editions: 2,
    recruitmentDates: {
      start: '2025-06-15',
      end: '2025-08-10',
      resultsDate: '2025-08-25'
    },
    requiredSubjects: ['Matematyka (poziom rozszerzony)', 'Jeden dodatkowy przedmiot ścisły'],
    tuitionFee: '0 PLN (finansowane przez państwo)',
    recruitmentFee: '85 PLN',
    seatsLimit: 80,
    description: 'Nowoczesny program łączący statystykę, programowanie, uczenie maszynowe i analitykę biznesową. Nacisk na praktyczne umiejętności analizy danych i narzędzia istotne dla przemysłu.'
  },
  {
    id: 4,
    name: 'Matematyka stosowana',
    level: 'Licencjat',
    mode: 'Stacjonarne',
    language: 'Polski',
    recruitmentStatus: 'open',
    editions: 1,
    recruitmentDates: {
      start: '2025-06-01',
      end: '2025-07-25',
      resultsDate: '2025-08-10'
    },
    requiredSubjects: ['Matematyka (poziom rozszerzony)'],
    tuitionFee: '0 PLN (finansowane przez państwo)',
    recruitmentFee: '85 PLN',
    seatsLimit: 50,
    description: 'Rygorystyczny program z matematyki czystej i stosowanej, w tym metod numerycznych, optymalizacji i modelowania matematycznego. Idealny dla studentów planujących karierę w badaniach, finansach lub inżynierii.'
  },
  {
    id: 5,
    name: 'Informatyka',
    level: 'Licencjat',
    mode: 'Niestacjonarne',
    language: 'Polski',
    recruitmentStatus: 'open',
    editions: 1,
    recruitmentDates: {
      start: '2025-07-01',
      end: '2025-08-31',
      resultsDate: '2025-09-10'
    },
    requiredSubjects: ['Matematyka (poziom podstawowy lub rozszerzony)'],
    tuitionFee: '3500 PLN/rok',
    recruitmentFee: '85 PLN',
    seatsLimit: 60,
    description: 'Program niestacjonarny zaprojektowany dla pracujących profesjonalistów. Zajęcia wieczorowe i weekendowe obejmujące podstawowe tematy informatyki z praktycznym ukierunkowaniem.'
  },
  {
    id: 6,
    name: 'Sztuczna inteligencja',
    level: 'Magisterskie',
    mode: 'Stacjonarne',
    language: 'Angielski',
    recruitmentStatus: 'open',
    editions: 1,
    recruitmentDates: {
      start: '2025-06-01',
      end: '2025-08-20',
      resultsDate: '2025-09-01'
    },
    requiredSubjects: ['Licencjat z informatyki, matematyki lub pokrewnej dziedziny'],
    tuitionFee: '5000 PLN/rok',
    recruitmentFee: '85 PLN',
    seatsLimit: 40,
    description: 'Specjalistyczny program magisterski z AI obejmujący głębokie uczenie, przetwarzanie języka naturalnego, widzenie komputerowe i uczenie ze wzmocnieniem. Zawiera partnerstwa z przemysłem i projekty badawcze.'
  },
  {
    id: 7,
    name: 'Cyberbezpieczeństwo',
    level: 'Licencjat',
    mode: 'Stacjonarne',
    language: 'Polski',
    recruitmentStatus: 'open',
    editions: 2,
    recruitmentDates: {
      start: '2025-06-10',
      end: '2025-08-05',
      resultsDate: '2025-08-20'
    },
    requiredSubjects: ['Matematyka (poziom rozszerzony)', 'Informatyka lub fizyka'],
    tuitionFee: '0 PLN (finansowane przez państwo)',
    recruitmentFee: '85 PLN',
    seatsLimit: 70,
    description: 'Kompleksowy program obejmujący bezpieczeństwo sieci, kryptografię, etyczny hacking i operacje bezpieczeństwa. Zawiera praktyczne laboratoria i certyfikaty branżowe.'
  },
  {
    id: 8,
    name: 'Inżynieria oprogramowania',
    level: 'Magisterskie',
    mode: 'Niestacjonarne',
    language: 'Polski',
    recruitmentStatus: 'closed',
    editions: 1,
    recruitmentDates: {
      start: '2025-05-01',
      end: '2025-06-30',
      resultsDate: '2025-07-15'
    },
    requiredSubjects: ['Licencjat z informatyki lub pokrewnej dziedziny'],
    tuitionFee: '4500 PLN/rok',
    recruitmentFee: '85 PLN',
    seatsLimit: 30,
    description: 'Program magisterski niestacjonarny dla profesjonalistów skupiony na architekturze oprogramowania, DevOps, metodykach zwinnych i zarządzaniu projektami.'
  }
]

export const schools = [
  { id: 1, name: 'I Liceum Ogólnokształcące im. Mikołaja Kopernika w Toruniu', voivodeship: 'kujawsko-pomorskie', city: 'Toruń' },
  { id: 2, name: 'XIV Liceum Ogólnokształcące im. Stanisława Staszica w Warszawie', voivodeship: 'mazowieckie', city: 'Warszawa' },
  { id: 3, name: 'II Liceum Ogólnokształcące im. Marii Konopnickiej w Krakowie', voivodeship: 'małopolskie', city: 'Kraków' },
  { id: 4, name: 'V Liceum Ogólnokształcące im. Józefa Wybickiego w Gdańsku', voivodeship: 'pomorskie', city: 'Gdańsk' },
  { id: 5, name: 'III Liceum Ogólnokształcące im. Adama Mickiewicza w Poznaniu', voivodeship: 'wielkopolskie', city: 'Poznań' }
]

export const subjects = [
  'Matematyka',
  'Język polski',
  'Język angielski',
  'Fizyka',
  'Chemia',
  'Biologia',
  'Geografia',
  'Historia',
  'Informatyka',
  'Język niemiecki',
  'Język francuski',
  'Język hiszpański',
  'Wiedza o społeczeństwie'
]

export const voivodeships = [
  'dolnośląskie',
  'kujawsko-pomorskie',
  'lubelskie',
  'lubuskie',
  'łódzkie',
  'małopolskie',
  'mazowieckie',
  'opolskie',
  'podkarpackie',
  'podlaskie',
  'pomorskie',
  'śląskie',
  'świętokrzyskie',
  'warmińsko-mazurskie',
  'wielkopolskie',
  'zachodniopomorskie'
]

export const postalCodeData = {
  '87-100': {
    voivodeship: 'kujawsko-pomorskie',
    county: 'toruński',
    commune: 'Toruń',
    city: 'Toruń'
  },
  '00-001': {
    voivodeship: 'mazowieckie',
    county: 'Warszawa',
    commune: 'Warszawa',
    city: 'Warszawa'
  },
  '30-001': {
    voivodeship: 'małopolskie',
    county: 'Kraków',
    commune: 'Kraków',
    city: 'Kraków'
  },
  '80-001': {
    voivodeship: 'pomorskie',
    county: 'Gdańsk',
    commune: 'Gdańsk',
    city: 'Gdańsk'
  },
  '60-001': {
    voivodeship: 'wielkopolskie',
    county: 'Poznań',
    commune: 'Poznań',
    city: 'Poznań'
  }
}

export const faqData = [
  {
    question: 'Jakie dokumenty są potrzebne do aplikacji?',
    answer: 'Potrzebujesz dyplomu lub świadectwa ukończenia szkoły średniej, wyników egzaminów (matura lub równoważne), zdjęcia oraz potwierdzenia opłaty rekrutacyjnej. Wszystkie dokumenty mogą być przesłane przez system online.'
  },
  {
    question: 'Kiedy otrzymam wyniki rekrutacji?',
    answer: 'Wyniki są publikowane zgodnie z harmonogramem rekrutacji dla każdego kierunku. Zazwyczaj wyniki są dostępne 2-3 tygodnie po terminie aplikacyjnym. Zostaniesz powiadomiony e-mailem i możesz sprawdzić swój status w panelu głównym.'
  },
  {
    question: 'Czy mogę aplikować na wiele kierunków?',
    answer: 'Tak, możesz aplikować na wiele kierunków. Każda aplikacja wymaga osobnej opłaty rekrutacyjnej i procesu składania. Możesz zarządzać wszystkimi swoimi aplikacjami z panelu głównego.'
  },
  {
    question: 'Jak mogę opłacić opłatę rekrutacyjną?',
    answer: 'Po uzupełnieniu aplikacji otrzymasz instrukcje płatności e-mailem. Możesz zapłacić online kartą kredytową lub przelewem bankowym. Płatność musi być zrealizowana przed terminem.'
  },
  {
    question: 'Czy mogę edytować aplikację po wysłaniu?',
    answer: 'Po wysłaniu aplikacje nie mogą być edytowane. Możesz jednak skontaktować się z biurem rekrutacji przez system wiadomości, jeśli musisz wprowadzić poprawki lub dostarczyć dodatkowe dokumenty.'
  },
  {
    question: 'Co jeśli mam zagraniczny dyplom?',
    answer: 'Zagraniczne dyplomy muszą być uznane przez polskie władze oświatowe. Musisz dostarczyć przetłumaczone i poświadczone kopie swoich dokumentów. Wybierz opcję "zagraniczny dyplom" w sekcji edukacji i postępuj zgodnie z dodatkowymi instrukcjami.'
  }
]

export const messages = [
  {
    id: 1,
    subject: 'Witamy w systemie rekrutacji',
    preview: 'Dziękujemy za rejestrację. Proszę uzupełnij swoją aplikację...',
    date: '2025-12-01',
    read: true,
    from: 'Biuro rekrutacji'
  },
  {
    id: 2,
    subject: 'Przypomnienie o terminie aplikacji',
    preview: 'Zbliża się termin dla kierunku Informatyka...',
    date: '2025-12-03',
    read: false,
    from: 'System'
  },
  {
    id: 3,
    subject: 'Ważne: Brakujące dokumenty',
    preview: 'Twoja aplikacja jest niekompletna. Proszę prześlij swój dyplom...',
    date: '2025-12-04',
    read: false,
    from: 'Biuro rekrutacji'
  }
]
