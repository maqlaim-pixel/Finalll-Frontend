import test from 'node:test'
import assert from 'node:assert/strict'
import { isTokenCurrent, tokenExpiry, tokenClaims, isAdminRole } from './authSession.js'
import { getOtpErrorMessage } from './otpErrors.js'

const token = claims => 'header.' + Buffer.from(JSON.stringify(claims)).toString('base64url') + '.signature'
test('JWT expiry is read in seconds and converted to milliseconds', () => {
  assert.equal(tokenExpiry(token({ exp: 3600 })), 3600000)
})
test('expired tokens and the exact expiry boundary are rejected on restore', () => {
  assert.equal(isTokenCurrent(token({ exp: 3600 }), 3600000), false)
  assert.equal(isTokenCurrent(token({ exp: 3600 }), 3600001), false)
  assert.equal(isTokenCurrent(token({ exp: 3600 }), 3599999), true)
})
test('malformed tokens and missing or non-numeric expiration are rejected', () => {
  for (const value of [null, '', 'invalid', token({}), token({ exp: '3600' })]) assert.equal(isTokenCurrent(value, 1), false)
})
test('customer and admin session roles remain distinct', () => {
  assert.equal(isAdminRole(tokenClaims(token({ role: 'customer' })).role), false)
  for (const role of ['admin', 'super_admin', 'editor', 'content_manager']) assert.equal(isAdminRole(role), true)
})
test('delivery failure gives a safe message without internal details', () => {
  const error = { response: { status: 502, data: { error: 'private provider response' } } }
  assert.equal(getOtpErrorMessage(error), 'Unable to send OTP email. Please try again or contact support.')
})
test('provider restriction remains useful to the customer', () => {
  assert.match(getOtpErrorMessage({ response: { status: 502, data: { error: 'Email delivery is restricted by the provider.' } } }), /restricted/)
})
test('OTP errors and cooldowns remain on-page errors', () => {
  assert.match(getOtpErrorMessage({ response: { status: 400, data: { error: 'OTP expired' } } }), /expired/)
  assert.match(getOtpErrorMessage({ response: { status: 429, data: { error: 'Please wait before requesting another OTP' } } }), /wait/)
})
