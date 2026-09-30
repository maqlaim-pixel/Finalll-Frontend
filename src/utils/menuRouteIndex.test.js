import test from 'node:test'
import assert from 'node:assert/strict'
import { getKnownMenuRouteName, isKnownMenuRoute } from './menuRouteIndex.js'

test('known menu destinations without a matching page use Coming Soon', () => {
  assert.equal(getKnownMenuRouteName('/packages/adventure/camping'), 'Camping Packages')
  assert.equal(isKnownMenuRoute('/packages/adventure/camping'), true)
  assert.equal(isKnownMenuRoute('/packages/adventure/wildlife'), true)
  assert.equal(isKnownMenuRoute('/packages/adventure/water'), true)
  assert.equal(isKnownMenuRoute('/packages/family'), true)
  assert.equal(isKnownMenuRoute('/packages/adventure'), true)
  assert.equal(isKnownMenuRoute('/packages/luxury'), true)
  assert.equal(isKnownMenuRoute('/mice/meetings/board'), true)
  assert.equal(isKnownMenuRoute('/destination-weddings/venues/beach'), true)
  assert.equal(isKnownMenuRoute('/international/europe/switzerland/zurich'), true)
  assert.equal(isKnownMenuRoute('/destination-weddings/guides/planning'), true)
  assert.equal(isKnownMenuRoute('/india/places/heritage'), true)
  assert.equal(isKnownMenuRoute('/medical-tourism/treatments/cardiac'), true)
})

test('working destinations in navigation are not sent to Coming Soon', () => {
  assert.equal(isKnownMenuRoute('/adventure/trekking-packages'), false)
  assert.equal(isKnownMenuRoute('/packages/adventure/trekking'), false)
  assert.equal(isKnownMenuRoute('/local-travel/airport-transfer'), false)
  assert.equal(isKnownMenuRoute('/packages?category=domestic'), false)
  assert.equal(isKnownMenuRoute('/international/thailand/packages'), false)
  assert.equal(isKnownMenuRoute('/international/uae/dubai'), false)
  assert.equal(isKnownMenuRoute('/international/singapore/singapore-city'), false)
  assert.equal(isKnownMenuRoute('/international/usa/new-york'), false)
  assert.equal(isKnownMenuRoute('/international/destinations/luxury'), false)
  assert.equal(isKnownMenuRoute('/international/new-zealand'), false)
  assert.equal(isKnownMenuRoute('/international/uae/packages'), false)
  assert.equal(isKnownMenuRoute('/packages/family/getaways'), true)
  assert.equal(isKnownMenuRoute('/medical-tourism/india'), false)
  assert.equal(isKnownMenuRoute('/medical-tourism/india/delhi'), false)
  assert.equal(isKnownMenuRoute('/holidays/family/getaways'), false)
  assert.equal(isKnownMenuRoute('/holidays/adventure/trekking'), false)
  assert.equal(isKnownMenuRoute('/holidays/domestic-honeymoon'), false)
  assert.equal(isKnownMenuRoute('/international/destinations/beach'), false)
  assert.equal(isKnownMenuRoute('/international/places/landmarks'), false)
  assert.equal(isKnownMenuRoute('/international/things-to-do/scuba'), false)
})

test('unknown paths are not classified as coming soon', () => {
  assert.equal(isKnownMenuRoute('/random-invalid-page-12345'), false)
  assert.equal(isKnownMenuRoute('/packages/unknown-made-up-route'), false)
  assert.equal(isKnownMenuRoute('/mice/unknown-made-up-route'), false)
})
