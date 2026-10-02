import test from 'node:test'
import assert from 'node:assert/strict'
import { getPublishedDestinationWeddingPackages, isDestinationWeddingPackage } from './weddingPackages.js'

const shimlaWedding = {
  id: 1,
  title: 'Shimla Celebration',
  state: 'Himachal Pradesh',
  category: 'Wedding',
  status: 'published',
  isActive: true,
}

test('destination wedding matching uses structured location and wedding taxonomy only', () => {
  assert.equal(isDestinationWeddingPackage(shimlaWedding, ['Himachal Pradesh', 'Himachal']), true)
  assert.equal(isDestinationWeddingPackage({ ...shimlaWedding, category: 'domestic', description: 'Destination wedding in Himachal' }, 'Himachal'), false)
  assert.equal(isDestinationWeddingPackage({ ...shimlaWedding, state: 'Punjab', tags: 'Himachal' }, 'Himachal'), false)
})

test('Kashmir matching excludes the published Ladakh adventure trip and includes only Kashmir/Jammu wedding taxonomy', () => {
  const ladakhRoadTrip = {
    id: 6,
    title: 'Ladakh Road Trip',
    destination: 'Ladakh',
    state: 'Jammu & Kashmir',
    category: 'domestic',
    tags: 'Adventure, Road Trip, Photography',
    status: 'published',
    isActive: true,
  }
  const dalLakeWedding = {
    id: 7,
    title: 'Dal Lake Wedding',
    destination: 'Srinagar',
    state: 'Jammu & Kashmir',
    category: 'Destination Wedding',
    status: 'published',
    isActive: true,
  }

  assert.equal(isDestinationWeddingPackage(ladakhRoadTrip, ['Jammu & Kashmir', 'Jammu and Kashmir', 'Kashmir']), false)
  assert.deepEqual(getPublishedDestinationWeddingPackages([ladakhRoadTrip, dalLakeWedding], ['Jammu & Kashmir', 'Jammu and Kashmir', 'Kashmir']), [dalLakeWedding])
})

test('Ayodhya wedding matching includes Ayodhya and Uttar Pradesh records with explicit wedding taxonomy only', () => {
  const ayodhyaWedding = {
    id: 8,
    title: 'Ayodhya Heritage Wedding',
    destination: 'Ayodhya',
    state: 'Uttar Pradesh',
    category: 'Destination Wedding',
    status: 'published',
  }
  const lucknowTour = {
    id: 9,
    title: 'Uttar Pradesh Heritage Tour',
    destination: 'Lucknow',
    state: 'Uttar Pradesh',
    category: 'domestic',
    tags: 'Heritage, Culture',
    status: 'published',
  }

  assert.deepEqual(getPublishedDestinationWeddingPackages([ayodhyaWedding, lucknowTour], ['Ayodhya', 'Uttar Pradesh']), [ayodhyaWedding])
})

test('Varanasi wedding matching accepts Varanasi/Banaras or Uttar Pradesh structured location metadata', () => {
  const varanasiWedding = {
    id: 10,
    title: 'Ganga Riverside Celebration',
    destination: 'Varanasi',
    state: 'Uttar Pradesh',
    category: 'Wedding',
    status: 'published',
  }
  const lucknowTour = {
    id: 11,
    title: 'Lucknow Heritage Tour',
    destination: 'Lucknow',
    state: 'Uttar Pradesh',
    category: 'domestic',
    tags: 'Culture, Heritage',
    status: 'published',
  }

  assert.deepEqual(getPublishedDestinationWeddingPackages([varanasiWedding, lucknowTour], ['Varanasi', 'Banaras', 'Kashi', 'Uttar Pradesh']), [varanasiWedding])
})

test('Thailand wedding packages match Thailand as destination or country only with explicit wedding taxonomy', () => {
  const thailandWedding = {
    id: 12,
    title: 'Island Celebration',
    destination: 'Phuket',
    country: 'Thailand',
    category: 'Destination Wedding',
    status: 'published',
  }
  const thailandHoliday = {
    id: 13,
    title: 'Thailand Tropical Escape',
    destination: 'Thailand',
    country: 'Thailand',
    category: 'international',
    status: 'published',
  }

  assert.equal(isDestinationWeddingPackage(thailandWedding, ['Thailand']), true)
  assert.deepEqual(getPublishedDestinationWeddingPackages([thailandWedding, thailandHoliday], ['Thailand']), [thailandWedding])
})

test('Maldives wedding packages match country metadata while ordinary Maldives holidays remain excluded', () => {
  const overwaterWedding = {
    id: 14,
    title: 'Overwater Villa Wedding Celebration',
    destination: 'North Malé Atoll',
    country: 'Maldives',
    category: 'International Destination Wedding',
    status: 'published',
    isActive: true,
  }
  const maldivesHoliday = {
    id: 15,
    title: 'Maldives Luxury Resort Escape',
    destination: 'Maldives',
    country: 'Maldives',
    category: 'international',
    tags: 'Luxury, Beach, Honeymoon',
    status: 'published',
    isActive: true,
  }

  assert.equal(isDestinationWeddingPackage(overwaterWedding, ['Maldives']), true)
  assert.deepEqual(getPublishedDestinationWeddingPackages([overwaterWedding, maldivesHoliday], ['Maldives']), [overwaterWedding])
})

test('Singapore wedding packages match country metadata while ordinary Singapore holidays remain excluded', () => {
  const singaporeWedding = {
    id: 16,
    title: 'Marina Bay Wedding Celebration',
    destination: 'Marina Bay',
    country: 'Singapore',
    category: 'International Destination Wedding',
    status: 'published',
    isActive: true,
  }
  const singaporeHoliday = {
    id: 17,
    title: 'Singapore City Highlights',
    destination: 'Singapore',
    country: 'Singapore',
    category: 'international',
    tags: 'City, Family, Shopping',
    status: 'published',
    isActive: true,
  }

  assert.equal(isDestinationWeddingPackage(singaporeWedding, ['Singapore']), true)
  assert.deepEqual(getPublishedDestinationWeddingPackages([singaporeWedding, singaporeHoliday], ['Singapore']), [singaporeWedding])
})

test('published destination wedding results exclude drafts, inactive records, and ordinary destination tours', () => {
  const packages = [
    shimlaWedding,
    { ...shimlaWedding, id: 2, status: 'draft' },
    { ...shimlaWedding, id: 3, isActive: false },
    { ...shimlaWedding, id: 4, category: 'domestic', title: 'Himachal road trip' },
    { ...shimlaWedding, id: 5, state: 'Jammu and Kashmir' },
  ]

  assert.deepEqual(getPublishedDestinationWeddingPackages(packages, ['Himachal Pradesh', 'Himachal']), [shimlaWedding])
  assert.deepEqual(getPublishedDestinationWeddingPackages(null, 'Himachal'), [])
})
