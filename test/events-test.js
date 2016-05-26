/* globals describe it */
var assert = require('assert')
var Player = require('..')
var Audio = require('./support/audio')

function eventHandler () {
  function handler (e, t, o) {
    handler.last = { event: e, time: t, object: o }
    handler.events.push(handler.last)
  }
  handler.last = null
  handler.events = []
  return handler
}

describe('events', function () {
  it('emit events', function () {
    var audio = new Audio('one')
    var player = Player(audio.ac, audio.buffers).connect(audio.ac.destination)
    player.onevent = eventHandler()
    player.play('one')
    assert.deepEqual(player.onevent.last, { event: 'start', time: 0, object: 'one' })
    player.stop()
    assert.deepEqual(player.onevent.last, { event: 'stop', time: 0, object: 'one' })
  })
  it('event handlers receives all events', function () {
    var player = Player(new Audio().ac)
    player.onevent = eventHandler()
    player.onready = eventHandler()
    player.onstart = eventHandler()
    player.emit('ready')
    player.emit('start')
    assert.equal(player.onready.events.length, 1)
    assert.equal(player.onstart.events.length, 1)
    assert.equal(player.onevent.events.length, 2)
  })
  it('add handlers', function () {
    var player = Player(new Audio().ac)
    var one = eventHandler()
    var two = eventHandler()
    player.on('event', one)
    player.on('event', two)
    player.emit('ready', 0, 'obj')
    assert.deepEqual(one.last, { event: 'ready', time: 0, object: 'obj' })
    assert.deepEqual(two.last, { event: 'ready', time: 0, object: 'obj' })
  })
  it('on returns the player', function () {
    var player = Player(new Audio().ac)
    assert(player === player.on('event', eventHandler()))
  })
})
