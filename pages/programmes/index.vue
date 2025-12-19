<template>
  <v-container fluid class="programmes-container pa-8">
    <!-- Header -->
    <div class="page-header mb-10">
      <h1 class="page-title mb-3">Kierunki studiów</h1>
      <p class="page-subtitle">
        Przeglądaj i filtruj dostępne kierunki, aby znaleźć idealny dla siebie
      </p>
    </div>

    <!-- Apple Filter Bar -->
    <div class="filter-wrapper mb-10">
      <div class="filter-card">
        <!-- Mobile Filter Toggle -->
        <div class="d-md-none mb-5">
          <button
            class="filter-toggle-btn"
            @click="showFilters = !showFilters"
          >
            <v-icon small class="mr-2">mdi-tune</v-icon>
            {{ showFilters ? 'Ukryj filtry' : 'Pokaż filtry' }}
            <span v-if="activeFiltersCount > 0" class="filter-badge">{{ activeFiltersCount }}</span>
          </button>
        </div>

        <!-- Filters Container -->
        <div v-show="showFilters || $vuetify.breakpoint.mdAndUp">
          <!-- Search Bar -->
          <div class="mb-8">
            <v-text-field
              v-model="filters.search"
              prepend-inner-icon="mdi-magnify"
              placeholder="Szukaj kierunków studiów..."
              outlined
              hide-details
              clearable
              class="apple-search-field"
              solo
              flat
            ></v-text-field>
          </div>

          <!-- Level Pills -->
          <div class="filter-section mb-7">
            <div class="filter-label mb-4">Poziom studiów</div>
            <v-chip-group
              v-model="levelIndex"
              mandatory
              column
            >
              <v-chip
                v-for="level in levelOptions"
                :key="level.value"
                :value="level.value"
                large
                class="apple-pill"
                @click="setLevel(level.value)"
              >
                {{ level.label }}
              </v-chip>
            </v-chip-group>
          </div>

          <!-- Mode Pills -->
          <div class="filter-section mb-7">
            <div class="filter-label mb-4">Tryb studiów</div>
            <v-chip-group
              v-model="modeIndex"
              mandatory
              column
            >
              <v-chip
                v-for="mode in modeOptions"
                :key="mode.value"
                :value="mode.value"
                large
                class="apple-pill"
                @click="setMode(mode.value)"
              >
                {{ mode.label }}
              </v-chip>
            </v-chip-group>
          </div>

          <!-- Category Tiles -->
          <div class="filter-section mb-7">
            <div class="filter-label mb-4">Dziedziny</div>
            <v-row dense>
              <v-col
                v-for="category in categoryOptions"
                :key="category.value"
                cols="6"
                sm="4"
                md="2"
              >
                <div
                  :class="['apple-category-tile', { 'active': isCategoryActive(category.value) }]"
                  @click="toggleCategory(category.value)"
                >
                  <v-icon :color="isCategoryActive(category.value) ? '#007AFF' : '#6E6E73'" size="28" class="mb-2">
                    {{ category.icon }}
                  </v-icon>
                  <div class="category-label">{{ category.label }}</div>
                </div>
              </v-col>
            </v-row>
          </div>

          <!-- Language Pills -->
          <div class="filter-section mb-5">
            <div class="filter-label mb-4">Język wykładowy</div>
            <v-chip-group
              v-model="languageIndex"
              mandatory
              column
            >
              <v-chip
                v-for="lang in languageOptions"
                :key="lang.value"
                :value="lang.value"
                large
                class="apple-pill"
                @click="setLanguage(lang.value)"
              >
                <span v-if="lang.label === 'Polski'" class="mr-1">🇵🇱</span>
                <span v-else-if="lang.label === 'Angielski'" class="mr-1">🇬🇧</span>
                {{ lang.label }}
              </v-chip>
            </v-chip-group>
          </div>

          <!-- Active Filters Summary -->
          <div v-if="activeFiltersCount > 0" class="filter-summary">
            <span class="summary-text">
              Aktywne filtry: <strong>{{ activeFiltersCount }}</strong> • 
              Znaleziono: <strong>{{ filteredProgrammes.length }}</strong> kierunków
            </span>
            <button class="reset-btn" @click="resetFilters">
              <v-icon x-small class="mr-1">mdi-close-circle</v-icon>
              Wyczyść wszystko
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Programmes Grid -->
    <div class="programmes-grid">
      <!-- Loading State -->
      <template v-if="loading">
        <div v-for="n in 3" :key="n" class="programme-card-skeleton">
          <v-skeleton-loader type="article"></v-skeleton-loader>
        </div>
      </template>

      <!-- Programme Cards -->
      <template v-else>
        <div
          v-for="programme in filteredProgrammes"
          :key="programme.id"
          class="programme-card"
          @click="$router.push(`/programmes/${programme.id}`)"
        >
          <!-- Cover Image -->
          <div class="card-cover" :style="{ backgroundImage: `url(${getCoverImage(programme.id)})` }"></div>
          
          <!-- Card Header -->
          <div class="card-header mb-4">
            <h3 class="programme-title mb-3">{{ programme.name }}</h3>
            
            <!-- Tags -->
            <div class="programme-tags">
              <span class="tag">{{ programme.level }}</span>
              <span class="tag">{{ programme.mode }}</span>
              <span class="tag">
                <span v-if="programme.language === 'Polski'">🇵🇱</span>
                <span v-else-if="programme.language === 'Angielski'">🇬🇧</span>
                {{ programme.language }}
              </span>
            </div>
          </div>

          <!-- Info Grid -->
          <div class="info-grid mb-6">
            <div class="info-item">
              <v-icon size="16" color="#6E6E73" class="info-icon">mdi-clock-outline</v-icon>
              <span class="info-label">Czas trwania:</span>
              <span class="info-value">3 lata</span>
            </div>
            
            <div class="info-item">
              <v-icon size="16" color="#6E6E73" class="info-icon">mdi-translate</v-icon>
              <span class="info-label">Język:</span>
              <span class="info-value">
                <span v-if="programme.language === 'Polski'">🇵🇱</span>
                <span v-else-if="programme.language === 'Angielski'">🇬🇧</span>
                {{ programme.language }}
              </span>
            </div>
            
            <div class="info-item">
              <v-icon size="16" color="#6E6E73" class="info-icon">mdi-school-outline</v-icon>
              <span class="info-label">Tryb:</span>
              <span class="info-value">{{ programme.mode }}</span>
            </div>
            
            <div class="info-item">
              <v-icon size="16" color="#6E6E73" class="info-icon">mdi-calendar-check</v-icon>
              <span class="info-label">Rekrutacja:</span>
              <span :class="['info-value', programme.recruitmentStatus === 'open' ? 'status-open' : 'status-closed']">
                {{ programme.recruitmentStatus === 'open' ? 'Otwarta' : 'Zamknięta' }}
              </span>
            </div>
            
            <div class="info-item">
              <v-icon size="16" color="#6E6E73" class="info-icon">mdi-cash</v-icon>
              <span class="info-label">Opłata:</span>
              <span class="info-value">{{ programme.recruitmentFee }}</span>
            </div>
            
            <div class="info-item">
              <v-icon size="16" color="#6E6E73" class="info-icon">mdi-account-group-outline</v-icon>
              <span class="info-label">Limit miejsc:</span>
              <span class="info-value">{{ programme.seatsLimit }}</span>
            </div>
          </div>

          <!-- CTA Row -->
          <div class="cta-row">
            <button
              v-if="programme.recruitmentStatus === 'open'"
              class="primary-btn"
              @click.stop="handleZapiszSie(programme)"
            >
              Zapisz się
            </button>
            <button
              v-else
              class="primary-btn disabled"
              disabled
            >
              Niedostępna
            </button>
            
            <button class="secondary-btn" @click.stop="$router.push(`/programmes/${programme.id}`)">
              Szczegóły
              <v-icon x-small class="ml-1">mdi-arrow-right</v-icon>
            </button>
            
            <button class="icon-btn ml-auto" @click.stop="toggleFavorite(programme.id)">
              <v-icon :color="isFavorite(programme.id) ? '#FFCC00' : '#C7C7CC'" size="20">
                {{ isFavorite(programme.id) ? 'mdi-star' : 'mdi-star-outline' }}
              </v-icon>
            </button>
          </div>
        </div>

        <!-- No Results -->
        <div v-if="filteredProgrammes.length === 0" class="no-results">
          <v-icon size="64" color="#C7C7CC" class="mb-4">mdi-magnify</v-icon>
          <h3 class="no-results-title mb-2">Nie znaleziono kierunków</h3>
          <p class="no-results-text">Spróbuj dostosować filtry lub zapytanie wyszukiwania</p>
        </div>
      </template>
    </div>
  </v-container>
</template>

<script>
import { programmes } from '~/data/mockData'

export default {
  data() {
    return {
      programmes,
      loading: true,
      showFilters: false,
      
      // Filter state
      filters: {
        level: null,
        mode: null,
        categories: [],
        language: null,
        search: ''
      },
      
      // UI indexes for chip groups
      levelIndex: null,
      modeIndex: null,
      languageIndex: null,
      
      // Filter options
      levelOptions: [
        { value: null, label: 'Wszystkie' },
        { value: 'licencjackie', label: 'Licencjackie' },
        { value: 'magisterskie', label: 'Magisterskie' },
        { value: 'podyplomowe', label: 'Podyplomowe' }
      ],
      
      modeOptions: [
        { value: null, label: 'Wszystkie' },
        { value: 'dzienne', label: 'Dzienne' },
        { value: 'zaoczne', label: 'Zaoczne' },
        { value: 'online', label: 'Online' }
      ],
      
      categoryOptions: [
        { value: 'IT', label: 'IT', icon: 'mdi-code-tags' },
        { value: 'social', label: 'Nauki społeczne', icon: 'mdi-account-group' },
        { value: 'humanities', label: 'Humanistyka', icon: 'mdi-book-open-variant' },
        { value: 'arts', label: 'Sztuka', icon: 'mdi-palette' },
        { value: 'business', label: 'Biznes i ekonomia', icon: 'mdi-finance' },
        { value: 'science', label: 'Nauki ścisłe', icon: 'mdi-flask' }
      ],
      
      languageOptions: [
        { value: null, label: 'Wszystkie' },
        { value: 'PL', label: 'Polski' },
        { value: 'EN', label: 'Angielski' }
      ],
      
      favorites: []
    }
  },
  
  computed: {
    filteredProgrammes() {
      let filtered = [...this.programmes]

      // Apply search
      if (this.filters.search) {
        const query = this.filters.search.toLowerCase()
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
        )
      }

      // Apply level filter
      if (this.filters.level) {
        filtered = filtered.filter(p => {
          const normalizedLevel = this.normalizeLevelValue(p.level)
          return normalizedLevel === this.filters.level
        })
      }
      
      // Apply mode filter
      if (this.filters.mode) {
        filtered = filtered.filter(p => {
          const normalizedMode = this.normalizeModeValue(p.mode)
          return normalizedMode === this.filters.mode
        })
      }
      
      // Apply category filter
      if (this.filters.categories.length > 0) {
        filtered = filtered.filter(p => {
          const programmeCategory = this.getProgrammeCategory(p)
          return this.filters.categories.includes(programmeCategory)
        })
      }
      
      // Apply language filter
      if (this.filters.language) {
        filtered = filtered.filter(p => {
          if (this.filters.language === 'PL') {
            return p.language === 'Polski'
          } else if (this.filters.language === 'EN') {
            return p.language === 'Angielski'
          }
          return true
        })
      }

      return filtered
    },
    
    activeFiltersCount() {
      let count = 0
      if (this.filters.level) count++
      if (this.filters.mode) count++
      if (this.filters.categories.length > 0) count += this.filters.categories.length
      if (this.filters.language) count++
      if (this.filters.search) count++
      return count
    }
  },
  
  mounted() {
    // Simulate loading
    setTimeout(() => {
      this.loading = false
    }, 600)
    
    // Initialize indexes to "all" option
    this.levelIndex = null
    this.modeIndex = null
    this.languageIndex = null
  },
  
  methods: {
    setLevel(value) {
      this.filters.level = value
    },
    
    setMode(value) {
      this.filters.mode = value
    },
    
    setLanguage(value) {
      this.filters.language = value
    },
    
    toggleCategory(category) {
      const index = this.filters.categories.indexOf(category)
      if (index > -1) {
        this.filters.categories.splice(index, 1)
      } else {
        this.filters.categories.push(category)
      }
    },
    
    isCategoryActive(category) {
      return this.filters.categories.includes(category)
    },
    
    getProgrammeCategory(programme) {
      // Map programme names to categories
      const name = programme.name.toLowerCase()
      if (name.includes('informatyk') || name.includes('ai') || name.includes('dan')) {
        return 'IT'
      }
      if (name.includes('matemat') || name.includes('fizyk')) {
        return 'science'
      }
      if (name.includes('ekonom') || name.includes('biznes')) {
        return 'business'
      }
      if (name.includes('społeczn')) {
        return 'social'
      }
      if (name.includes('sztuk') || name.includes('design')) {
        return 'arts'
      }
      if (name.includes('histori') || name.includes('filologi')) {
        return 'humanities'
      }
      return 'IT' // default
    },
    
    normalizeLevelValue(level) {
      if (level === 'Licencjat') return 'licencjackie'
      if (level === 'Magisterskie') return 'magisterskie'
      if (level === 'Podyplomowe') return 'podyplomowe'
      return null
    },
    
    normalizeModeValue(mode) {
      if (mode === 'Stacjonarne') return 'dzienne'
      if (mode === 'Niestacjonarne') return 'zaoczne'
      if (mode === 'Online') return 'online'
      return null
    },
    
    resetFilters() {
      this.filters = {
        level: null,
        mode: null,
        categories: [],
        language: null,
        search: ''
      }
      this.levelIndex = null
      this.modeIndex = null
      this.languageIndex = null
    },
    
    handleZapiszSie(programme) {
      if (!this.$store.getters.isAuthenticated) {
        // Save pending programme and redirect to register
        this.$store.commit('SET_PENDING_PROGRAMME', programme.id)
        this.$router.push('/auth/register')
      } else {
        // Create application and redirect to dashboard
        this.$store.dispatch('createApplication', programme.id)
          .then(() => {
            this.$router.push('/dashboard')
          })
      }
    },
    
    toggleFavorite(programmeId) {
      const index = this.favorites.indexOf(programmeId)
      if (index > -1) {
        this.favorites.splice(index, 1)
      } else {
        this.favorites.push(programmeId)
      }
    },
    
    getCoverImage(programmeId) {
      const images = {
        1: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',  // Informatyka - code/tech
        2: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',  // Informatyka stosowana - digital world
        3: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',  // Nauka o danych - graphs/analytics
        4: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',  // Cyberbezpieczeństwo - security
        5: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',  // Inżynieria oprogramowania - tech devices
        6: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=400&fit=crop',  // Sztuczna inteligencja - AI/abstract
        7: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',  // Technologie webowe - laptop/code
        8: 'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=400&fit=crop',  // Systemy wbudowane - electronics
      }
      return images[programmeId] || 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=400&fit=crop'
    },
    
    isFavorite(programmeId) {
      return this.favorites.includes(programmeId)
    }
  }
}
</script>

<style scoped>
/* ===== APPLE DESIGN SYSTEM ===== */

/* Container */
.programmes-container {
  background: #F5F5F7;
  min-height: 100vh;
}

/* Page Header */
.page-header {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 34px;
  font-weight: 600;
  color: #1C1C1E;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 17px;
  font-weight: 400;
  color: #6E6E73;
  line-height: 1.5;
}

/* Filter Wrapper */
.filter-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.filter-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 28px 32px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.filter-toggle-btn {
  width: 100%;
  padding: 14px 20px;
  background: #FFFFFF;
  border: 1px solid #E5E5E7;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #1C1C1E;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.filter-toggle-btn:hover {
  background: #F5F5F7;
}

.filter-badge {
  margin-left: auto;
  background: #007AFF;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
}

/* Search Field */
.apple-search-field {
  border-radius: 10px !important;
}

.apple-search-field >>> .v-input__control {
  min-height: 44px !important;
}

.apple-search-field >>> .v-input__slot {
  background: #F5F5F7 !important;
  border: 1px solid #E5E5E7 !important;
  box-shadow: none !important;
}

.apple-search-field >>> input {
  font-size: 17px;
  font-weight: 400;
  color: #1C1C1E;
}

.apple-search-field >>> input::placeholder {
  color: #C7C7CC;
}

/* Filter Sections */
.filter-section {
  margin-bottom: 32px;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #6E6E73;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

/* Pills */
.apple-pill {
  border-radius: 20px !important;
  border: 1px solid #C7C7CC !important;
  font-weight: 500;
  font-size: 15px;
  height: 40px !important;
  transition: all 0.15s ease;
  background: #FFFFFF !important;
  color: #1C1C1E !important;
  box-shadow: none !important;
  padding: 0 20px !important;
}

.apple-pill:hover {
  border-color: #007AFF !important;
  background: rgba(0, 122, 255, 0.05) !important;
}

.apple-pill.v-chip--active {
  background: #007AFF !important;
  border-color: #007AFF !important;
  color: #FFFFFF !important;
}

.apple-pill.v-chip--active >>> .v-chip__content {
  color: #FFFFFF !important;
}

/* Category Tiles */
.apple-category-tile {
  cursor: pointer;
  border-radius: 10px;
  border: 1px solid #E5E5E7;
  padding: 20px 12px;
  background: #FFFFFF;
  transition: all 0.15s ease;
  text-align: center;
  height: 100%;
}

.apple-category-tile:hover {
  border-color: #007AFF;
  background: rgba(0, 122, 255, 0.03);
}

.apple-category-tile.active {
  border-color: #007AFF;
  background: rgba(0, 122, 255, 0.05);
}

.category-label {
  font-size: 13px;
  font-weight: 500;
  color: #1C1C1E;
  line-height: 1.3;
}

.apple-category-tile.active .category-label {
  color: #007AFF;
  font-weight: 600;
}

/* Filter Summary */
.filter-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20px;
  border-top: 1px solid #E5E5E7;
}

.summary-text {
  font-size: 14px;
  color: #6E6E73;
  font-weight: 400;
}

.summary-text strong {
  color: #1C1C1E;
  font-weight: 600;
}

.reset-btn {
  background: none;
  border: none;
  color: #007AFF;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.reset-btn:hover {
  background: rgba(0, 122, 255, 0.08);
}

/* Programmes Grid */
.programmes-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}

@media (max-width: 768px) {
  .programmes-grid {
    grid-template-columns: 1fr;
  }
}

/* Programme Card */
.programme-card {
  background: #FFFFFF;
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  cursor: pointer;
  overflow: hidden;
}

.programme-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

/* Cover Image */
.card-cover {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  background-color: #F5F5F7;
}

.card-header {
  margin-bottom: 20px;
  padding: 24px 28px 0 28px;
}

.programme-title {
  font-size: 22px;
  font-weight: 600;
  color: #1C1C1E;
  line-height: 1.3;
  letter-spacing: -0.3px;
  margin-bottom: 12px;
}

.programme-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: #E5E5E7;
  color: #1C1C1E;
  font-size: 13px;
  font-weight: 500;
  border-radius: 12px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  padding: 20px 28px;
  border-top: 1px solid #E5E5E7;
  border-bottom: 1px solid #E5E5E7;
}

.info-item {
  display: grid;
  grid-template-columns: 20px auto 1fr;
  gap: 10px;
  align-items: center;
}

.info-icon {
  grid-column: 1;
}

.info-label {
  grid-column: 2;
  font-size: 14px;
  color: #6E6E73;
  font-weight: 400;
}

.info-value {
  grid-column: 3;
  font-size: 14px;
  color: #1C1C1E;
  font-weight: 500;
  text-align: right;
}

.status-open {
  color: #34C759 !important;
}

.status-closed {
  color: #C7C7CC !important;
}

/* CTA Row */
.cta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  padding: 0 28px 28px 28px;
}

.primary-btn {
  background: #007AFF !important;
  color: #FFFFFF !important;
  border: none !important;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.primary-btn:hover {
  background: #0051D5 !important;
}

.primary-btn.disabled {
  background: #E5E5E7 !important;
  color: #C7C7CC !important;
  cursor: not-allowed;
}

.secondary-btn {
  background: none !important;
  border: none !important;
  color: #007AFF !important;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
}

.secondary-btn:hover {
  background: rgba(0, 122, 255, 0.08) !important;
  color: #007AFF !important;
}

.icon-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: #F5F5F7;
}

/* No Results */
.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px 24px;
}

.no-results-title {
  font-size: 20px;
  font-weight: 600;
  color: #1C1C1E;
  margin-bottom: 8px;
}

.no-results-text {
  font-size: 15px;
  color: #6E6E73;
  font-weight: 400;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .programmes-container {
    padding: 16px !important;
  }

  .page-title {
    font-size: 28px;
  }

  .filter-card {
    padding: 20px;
  }

  .programme-card {
    padding: 20px;
  }

  .cta-row {
    flex-direction: column;
    align-items: stretch;
  }

  .primary-btn,
  .secondary-btn {
    width: 100%;
    justify-content: center;
  }

  .icon-btn {
    margin-left: 0 !important;
    align-self: center;
  }
}
</style>
