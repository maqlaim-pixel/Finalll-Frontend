import test from 'node:test'
import assert from 'node:assert/strict'
import { filterIndiaExperienceActivities, getPublishedActivities } from './indiaExperiences.js'

const activities = [
  { id: 1, name: 'Paragliding', category: 'Adventure', status: 'published' },
  { id: 2, name: 'Scuba diving', category: 'Water Sports', status: 'published' },
  { id: 3, name: 'Mountain trek', category: 'Trekking', status: 'published' },
  { id: 4, name: 'Wildlife safari', category: 'Wildlife', status: 'published' },
  { id: 5, name: 'Cultural walk', category: 'Culture & Heritage', status: 'published' },
  { id: 6, name: 'Family activity', category: 'Family Friendly', status: 'published' },
  { id: 7, name: 'Draft paragliding', category: 'Adventure', status: 'draft' },
  null,
]

test('published activities excludes drafts, null records and malformed API values', () => {
  assert.deepEqual(getPublishedActivities(activities).map(activity => activity.id), [1, 2, 3, 4, 5, 6])
  assert.deepEqual(getPublishedActivities({ activities }), [])
  assert.deepEqual(getPublishedActivities(null), [])
})

test('experience categories match only published activities in the configured category family', () => {
  assert.deepEqual(filterIndiaExperienceActivities(activities, 'adventure').map(activity => activity.id), [1, 2, 3])
  assert.deepEqual(filterIndiaExperienceActivities(activities, 'water-sports').map(activity => activity.id), [2])
  assert.deepEqual(filterIndiaExperienceActivities(activities, 'trekking').map(activity => activity.id), [3])
  assert.deepEqual(filterIndiaExperienceActivities(activities, 'wildlife').map(activity => activity.id), [4])
  assert.deepEqual(filterIndiaExperienceActivities(activities, 'culture').map(activity => activity.id), [5])
  assert.deepEqual(filterIndiaExperienceActivities(activities, 'family').map(activity => activity.id), [6])
  assert.deepEqual(filterIndiaExperienceActivities(activities, 'unlisted').map(activity => activity.id), [])
})

test('all experiences includes every published activity without manufacturing records', () => {
  assert.deepEqual(filterIndiaExperienceActivities(activities).map(activity => activity.id), [1, 2, 3, 4, 5, 6])
  assert.deepEqual(filterIndiaExperienceActivities([]), [])
})
