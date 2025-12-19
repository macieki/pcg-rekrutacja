<template>
  <v-container fluid class="programme-detail-container pa-0">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <v-skeleton-loader type="article, actions"></v-skeleton-loader>
    </div>

    <!-- Programme Content -->
    <template v-else-if="programme">
      <!-- Back Navigation -->
      <div class="back-nav">
        <button class="back-btn" @click="$router.push('/programmes')">
          <v-icon size="18" color="#007AFF">mdi-chevron-left</v-icon>
          <span>Kierunki</span>
        </button>
      </div>

      <!-- Hero Header -->
      <div class="hero-header">
        <div class="hero-cover" :style="{ backgroundImage: `url(${getCoverImage(programme.id)})` }"></div>
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">{{ programme.name }}</h1>
            <div class="hero-tags">
              <span class="tag">{{ programme.level }}</span>
              <span class="tag">{{ programme.mode }}</span>
              <span class="tag">
                <span v-if="programme.language === 'Polski'">🇵🇱</span>
                <span v-else-if="programme.language === 'Angielski'">🇬🇧</span>
                {{ programme.language }}
              </span>
            </div>
          </div>
          <button
            class="hero-cta"
            :class="{ 'disabled': programme.recruitmentStatus !== 'open' }"
            :disabled="programme.recruitmentStatus !== 'open'"
            @click="handleZapiszSie"
          >
            Zapisz się
          </button>
        </div>
      </div>

      <!-- Main Container -->
      <div class="page-container">
        
        <!-- Summary Tile (Full Width) -->
        <div class="summary-tile">
          <div class="summary-status">
            <div class="status-badge" :class="programme.recruitmentStatus === 'open' ? 'status-open' : 'status-closed'">
              <span class="status-dot"></span>
              <span>Rekrutacja {{ programme.recruitmentStatus === 'open' ? 'otwarta' : 'zamknięta' }}</span>
            </div>
          </div>
          
          <div class="summary-grid">
            <div class="summary-item">
              <v-icon size="20" color="#6E6E73">mdi-clock-outline</v-icon>
              <div class="summary-text">
                <div class="summary-label">Czas trwania</div>
                <div class="summary-value">{{ getProgrammeDuration(programme.id) }}</div>
              </div>
            </div>
            
            <div class="summary-item">
              <v-icon size="20" color="#6E6E73">mdi-school-outline</v-icon>
              <div class="summary-text">
                <div class="summary-label">Tryb studiów</div>
                <div class="summary-value">{{ programme.mode }}</div>
              </div>
            </div>
            
            <div class="summary-item">
              <v-icon size="20" color="#6E6E73">mdi-translate</v-icon>
              <div class="summary-text">
                <div class="summary-label">Język wykładowy</div>
                <div class="summary-value">
                  <span v-if="programme.language === 'Polski'">🇵🇱</span>
                  <span v-else-if="programme.language === 'Angielski'">🇬🇧</span>
                  {{ programme.language }}
                </div>
              </div>
            </div>
            
            <div class="summary-item">
              <v-icon size="20" color="#6E6E73">mdi-cash</v-icon>
              <div class="summary-text">
                <div class="summary-label">Czesne</div>
                <div class="summary-value">{{ programme.tuitionFee }}</div>
              </div>
            </div>
            
            <div class="summary-item">
              <v-icon size="20" color="#6E6E73">mdi-calendar-range</v-icon>
              <div class="summary-text">
                <div class="summary-label">Aplikacje</div>
                <div class="summary-value">{{ formatDateShort(programme.recruitmentDates.start) }} – {{ formatDateShort(programme.recruitmentDates.end) }}</div>
              </div>
            </div>
            
            <div class="summary-item">
              <v-icon size="20" color="#6E6E73">mdi-account-group-outline</v-icon>
              <div class="summary-text">
                <div class="summary-label">Miejsc</div>
                <div class="summary-value">{{ programme.seatsLimit }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Masonry Grid (2 columns) -->
        <div class="masonry-grid">
          
          <!-- LEFT COLUMN -->
          <div class="masonry-column">
            
            <!-- Requirements -->
            <div class="tile">
              <h2 class="tile-heading">Wymagania wstępne</h2>
              <div class="tile-body">
                <ul class="bullet-list">
                  <li v-for="(requirement, index) in programme.requiredSubjects" :key="index">
                    {{ requirement }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Additional Exams -->
            <div v-if="programme.additionalExams && programme.additionalExams.required" class="tile tile-warning">
              <h2 class="tile-heading">
                <v-icon left color="#FF9500">mdi-alert-circle</v-icon>
                Egzaminy dodatkowe
              </h2>
              <div class="tile-body">
                <p class="tile-text mb-4">
                  Ten kierunek wymaga zdania dodatkowych egzaminów kwalifikacyjnych:
                </p>
                <div class="exam-list">
                  <div v-for="exam in programme.additionalExams.exams" :key="exam.name" class="exam-item">
                    <h4 class="exam-name">{{ exam.name }}</h4>
                    <p class="exam-description">{{ exam.description }}</p>
                    <div class="exam-details">
                      <span><v-icon size="14">mdi-calendar</v-icon> {{ exam.date }}</span>
                      <span><v-icon size="14">mdi-clock</v-icon> {{ exam.duration }}</span>
                    </div>
                  </div>
                </div>
                <div class="info-rows mt-4">
                  <div class="info-row">
                    <span class="row-label">Miejsce</span>
                    <span class="row-value">{{ programme.additionalExams.examLocation }}</span>
                  </div>
                  <div class="info-row">
                    <span class="row-label">Termin rejestracji</span>
                    <span class="row-value">{{ programme.additionalExams.registrationDeadline }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Fees -->
            <div class="tile">
              <h2 class="tile-heading">Opłaty</h2>
              <div class="tile-body">
                <div class="info-rows">
                  <div class="info-row">
                    <span class="row-label">Czesne</span>
                    <span class="row-value">{{ programme.tuitionFee }}</span>
                  </div>
                  <div class="info-row">
                    <span class="row-label">Opłata rekrutacyjna</span>
                    <span class="row-value">{{ programme.recruitmentFee }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- About Programme -->
            <div class="tile">
              <h2 class="tile-heading">O kierunku</h2>
              <div class="tile-body">
                <p class="tile-text">{{ getExtendedDescription(programme.id) }}</p>
              </div>
            </div>

            <!-- Apply CTA in Column -->
            <div class="tile tile-cta">
              <button
                class="cta-column-btn"
                :class="{ 'disabled': programme.recruitmentStatus !== 'open' }"
                :disabled="programme.recruitmentStatus !== 'open'"
                @click="handleZapiszSie"
              >
                Aplikuj teraz
              </button>
              <p class="cta-column-subtext">Proces aplikacji zajmuje około 15 minut</p>
            </div>

          </div>

          <!-- RIGHT COLUMN -->
          <div class="masonry-column">
            
            <!-- Recruitment Timeline -->
            <div class="tile">
              <h2 class="tile-heading">Harmonogram rekrutacji</h2>
              <div class="tile-body">
                <div class="info-rows">
                  <div class="info-row">
                    <span class="row-label">Okres aplikacji</span>
                    <span class="row-value">{{ formatDate(programme.recruitmentDates.start) }} – {{ formatDate(programme.recruitmentDates.end) }}</span>
                  </div>
                  <div class="info-row">
                    <span class="row-label">Ogłoszenie wyników</span>
                    <span class="row-value">{{ formatDate(programme.recruitmentDates.resultsDate) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Campus Life -->
            <div class="tile tile-campus">
              <h2 class="tile-heading">Poznaj nasz kampus</h2>
              <div class="tile-body">
                <div class="campus-media">
                  <div class="campus-video-wrapper">
                    <iframe
                      :src="getProgrammeVideo(programme.id)"
                      frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen
                      class="campus-video"
                    ></iframe>
                  </div>
                  
                  <div class="campus-gallery">
                    <div class="gallery-item">
                      <img src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&h=600&fit=crop" alt="Kampus" class="gallery-img" />
                      <span class="gallery-caption">Kampus główny</span>
                    </div>
                    <div class="gallery-item">
                      <img src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop" alt="Biblioteka" class="gallery-img" />
                      <span class="gallery-caption">Biblioteka uniwersytecka</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </template>

    <!-- Not Found -->
    <div v-else class="not-found">
      <v-icon size="80" color="#C7C7CC">mdi-alert-circle-outline</v-icon>
      <h2 class="not-found-title">Kierunek nie znaleziony</h2>
      <p class="not-found-text">
        Kierunek, którego szukasz, nie istnieje lub został usunięty.
      </p>
      <button class="primary-btn-large" @click="$router.push('/programmes')">
        Powrót do kierunków
      </button>
    </div>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { programmes } from '~/data/mockData'

export default {
  data() {
    return {
      programmes,
      loading: true,
      isFavorite: false
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    programme() {
      const id = parseInt(this.$route.params.id)
      return this.programmes.find(p => p.id === id)
    }
  },
  mounted() {
    // Simulate loading
    setTimeout(() => {
      this.loading = false
    }, 500)
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    },
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
      const message = this.isFavorite ? 'Dodano do ulubionych' : 'Usunięto z ulubionych'
      this.$store.commit('SHOW_SNACKBAR', { message, color: 'info' })
    },
    getCoverImage(programmeId) {
      const images = {
        1: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop',  // Informatyka - code/tech
        2: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=1200&h=400&fit=crop',  // Informatyka stosowana - digital world
        3: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop',  // Nauka o danych - graphs/analytics
        4: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=400&fit=crop',  // Cyberbezpieczeństwo - security
        5: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=1200&h=400&fit=crop',  // Inżynieria oprogramowania - tech devices
        6: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=400&fit=crop',  // Sztuczna inteligencja - AI/abstract
        7: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=1200&h=400&fit=crop',  // Technologie webowe - laptop/code
        8: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=400&fit=crop',  // Systemy wbudowane - electronics
      }
      return images[programmeId] || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&h=400&fit=crop'
    },
    formatDateShort(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
    },
    getProgrammeDuration(programmeId) {
      const durations = {
        1: '3 lata',
        2: '2 lata',
        3: '3 lata',
        4: '3 lata',
        5: '3 lata',
        6: '2 lata',
        7: '3 lata',
        8: '3 lata',
      }
      return durations[programmeId] || '3 lata'
    },
    getExtendedDescription(programmeId) {
      const descriptions = {
        1: 'Program skupia się na algorytmach, strukturach danych, inżynierii oprogramowania i sztucznej inteligencji. Studenci rozwijają umiejętności projektowania aplikacji, programowania obiektowego oraz wdrażania nowoczesnych technologii w środowiskach przemysłowych. Zajęcia prowadzone są przez kadrę z doświadczeniem komercyjnym i akademickim. Absolwenci są przygotowani do pracy jako programiści, architektci systemów oraz specjaliści IT.',
        2: 'Program skupia się na systemach rozproszonych, uczeniu maszynowym, przetwarzaniu danych w chmurze i cyberbezpieczeństwie. Studenci rozwijają umiejętności projektowania skalowalnych aplikacji, analityki danych oraz wdrażania nowoczesnych technologii w środowiskach przemysłowych. Zajęcia prowadzone są przez kadrę międzynarodową z doświadczeniem komercyjnym.',
        3: 'Program koncentruje się na analizie danych, uczeniu maszynowym, statystyce i wizualizacji danych. Studenci uczą się przetwarzania dużych zbiorów danych, budowy modeli predykcyjnych oraz stosowania narzędzi analitycznych. Absolwenci znajdują zatrudnienie jako data scientists, analitycy biznesowi i specjaliści machine learning.',
        4: 'Program obejmuje bezpieczeństwo sieci, kryptografię, testowanie penetracyjne i zarządzanie ryzykiem. Studenci zdobywają praktyczne umiejętności w zakresie ochrony systemów informatycznych, analizy zagrożeń i reagowania na incydenty bezpieczeństwa. Absolwenci pracują jako specjaliści cyberbezpieczeństwa i audytorzy IT.',
        5: 'Program łączy projektowanie aplikacji, testowanie oprogramowania, metodyki zwinne i DevOps. Studenci uczą się tworzenia nowoczesnych aplikacji webowych i mobilnych, zarządzania projektami oraz automatyzacji procesów. Absolwenci znajdują zatrudnienie jako inżynierowie oprogramowania i tech leadzi.',
        6: 'Program koncentruje się na głębokim uczeniu, przetwarzaniu języka naturalnego, wizji komputerowej i systemach rekomendacyjnych. Studenci projektują inteligentne systemy, rozwijają modele AI i wdrażają rozwiązania w rzeczywistych aplikacjach. Absolwenci pracują jako AI engineers i research scientists.',
        7: 'Program obejmuje frontend development, backend development, architektury webowe i security. Studenci uczą się nowoczesnych frameworków, REST API, baz danych oraz cloud computing. Absolwenci znajdują zatrudnienie jako full-stack developerzy i web architects.',
        8: 'Program łączy elektronikę, mikrokontrolery, systemy czasu rzeczywistego i IoT. Studenci projektują rozwiązania embedded, uczą się programowania niskopoziomowego oraz integracji hardware-software. Absolwenci pracują w przemyśle motoryzacyjnym, automatyce i elektronice użytkowej.',
      }
      return descriptions[programmeId] || this.programme.description
    },
    getProgrammeVideo(programmeId) {
      return 'https://www.youtube.com/embed/ScMzIvxBSi4'
    },
    getProgrammeImage(programmeId) {
      return 'https://source.unsplash.com/800x600/?students,university,campus'
    },
    handleZapiszSie() {
      if (!this.isAuthenticated) {
        // Save pending programme and redirect to register
        this.$store.commit('SET_PENDING_PROGRAMME', this.programme.id)
        this.$router.push('/auth/register')
      } else {
        // Create application and redirect to personal data form
        this.$store.dispatch('createApplication', this.programme.id)
          .then(() => {
            this.$router.push('/applications/current/personal-data')
          })
      }
    },
    async handleApply() {
      // Check if user is logged in
      if (!this.isAuthenticated) {
        this.$router.push('/auth/register')
        return
      }

      // Create new application
      try {
        const application = await this.$store.dispatch('createApplication', this.programme.id)
        this.$router.push('/applications/current/personal-data')
      } catch (error) {
        this.$store.commit('SHOW_SNACKBAR', { 
          message: 'Nie udało się utworzyć aplikacji', 
          color: 'error' 
        })
      }
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }
}
</script>

<style scoped>
/* Container */
.programme-detail-container {
  background: #F5F5F7;
  min-height: 100vh;
}

.loading-state {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* Back Navigation */
.back-nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 24px 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: #007AFF;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 12px 8px 8px;
  border-radius: 8px;
  transition: all 0.15s ease;
}

.back-btn:hover {
  background: rgba(0, 122, 255, 0.08);
}

/* Hero Header */
.hero-header {
  background: #FFFFFF;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  margin-bottom: 32px;
  overflow: hidden;
}

.hero-cover {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  background-color: #F5F5F7;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.hero-text {
  flex: 1;
}

.hero-title {
  font-size: 32px;
  font-weight: 600;
  color: #1C1C1E;
  letter-spacing: -0.02em;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.hero-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #E5E5E7;
  color: #1C1C1E;
  padding: 6px 14px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
}

.hero-cta {
  background: #007AFF !important;
  color: #FFFFFF !important;
  border: none;
  padding: 12px 28px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.hero-cta:hover:not(.disabled) {
  background: #0051D5 !important;
}

.hero-cta.disabled {
  background: #E5E5E7 !important;
  color: #C7C7CC !important;
  cursor: not-allowed;
}

/* Page Container */
.page-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 80px;
}

/* Summary Tile (Full Width) */
.summary-tile {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  padding: 32px;
  margin-bottom: 32px;
}

.summary-status {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #E5E5EA;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-badge.status-open {
  background: rgba(52, 199, 89, 0.1);
  color: #34C759;
}

.status-badge.status-closed {
  background: #E5E5E7;
  color: #6E6E73;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.summary-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.summary-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.summary-label {
  font-size: 13px;
  color: #6E6E73;
  font-weight: 500;
}

.summary-value {
  font-size: 15px;
  color: #1C1C1E;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Masonry Grid (2 columns) */
.masonry-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 968px) {
  .masonry-grid {
    grid-template-columns: 1fr;
  }
}

.masonry-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Tile Base Style */
.tile {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  padding: 28px;
}

.tile-heading {
  font-size: 22px;
  font-weight: 600;
  color: #1C1C1E;
  letter-spacing: -0.01em;
  margin: 0 0 20px 0;
}

.tile-body {
  font-size: 15px;
  color: #1C1C1E;
  line-height: 1.6;
}

.tile-text {
  margin: 0;
}

/* Bullet List */
.bullet-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bullet-list li {
  padding-left: 24px;
  position: relative;
}

.bullet-list li:before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #007AFF;
}

/* Info Rows */
.info-rows {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #E5E5EA;
}

.info-row:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.row-label {
  font-size: 15px;
  color: #6E6E73;
  font-weight: 500;
}

.row-value {
  font-size: 15px;
  color: #1C1C1E;
  font-weight: 600;
  text-align: right;
}

/* Campus Life Tile */
.tile-campus {
  padding: 28px;
}

.campus-media {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.campus-video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  border-radius: 10px;
  background: #F5F5F7;
}

.campus-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.campus-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.gallery-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.gallery-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
  background: #F5F5F7;
}

.gallery-caption {
  font-size: 13px;
  color: #6E6E73;
  font-weight: 500;
  text-align: center;
}

/* Warning Tile for Exams */
.tile-warning {
  background: linear-gradient(135deg, #FFF5E6 0%, #FFFFFF 100%);
  border: 2px solid #FF9500;
}

.exam-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.exam-item {
  padding: 16px;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #FF9500;
}

.exam-name {
  font-size: 16px;
  font-weight: 600;
  color: #1C1C1E;
  margin: 0 0 8px 0;
}

.exam-description {
  font-size: 14px;
  color: #6E6E73;
  line-height: 1.5;
  margin: 0 0 8px 0;
}

.exam-details {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6E6E73;
}

.exam-details span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* CTA in Column Tile */
.tile-cta {
  text-align: center;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #F5F5F7;
}

.cta-column-btn {
  background: #007AFF !important;
  color: #FFFFFF !important;
  border: none;
  padding: 14px 32px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  width: 100%;
}

.cta-column-btn:hover:not(.disabled) {
  background: #0051D5 !important;
}

.cta-column-btn.disabled {
  background: #E5E5E7 !important;
  color: #C7C7CC !important;
  cursor: not-allowed;
}

.cta-column-subtext {
  font-size: 13px;
  color: #6E6E73;
  margin-top: 12px;
  margin-bottom: 0;
}

/* Not Found */
.not-found {
  max-width: 600px;
  margin: 120px auto;
  padding: 60px 40px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.not-found-title {
  font-size: 24px;
  font-weight: 600;
  color: #1C1C1E;
  margin: 24px 0 12px 0;
}

.not-found-text {
  font-size: 16px;
  color: #6E6E73;
  line-height: 1.5;
  margin: 0 0 32px 0;
}
</style>
