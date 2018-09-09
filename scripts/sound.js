(function(GAME) {

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  var gainNode = audioCtx.createGain();
  gainNode.gain.value = GAME.settings.soundVolume;
  gainNode.connect(audioCtx.destination);

  function getNoteFrequency(noteNumber) {
    return Math.round(Math.pow(2, (noteNumber - 49)/12) * 440);
  }

  function getOscillators(n, waveType) {
    var oscillators = [];

    for (var i = 0; i < n; i++) {
      var oscillator = audioCtx.createOscillator();

      oscillator.type = waveType;
      oscillator.start();

      oscillators.push(oscillator);
    };

    return oscillators;
  }

  function playNotes(notes, oscillators, isOscillatorConnected) {
    oscillators.forEach(function(oscillator, index) {
      var note = notes[index];

      if (note) {
        oscillator.frequency.value = getNoteFrequency(note);
        isOscillatorConnected[index] = true;
        oscillator.connect(gainNode);
      }
    });
  }

  function disconnectOscillators(oscillators, isOscillatorConnected) {
    oscillators.forEach(function(oscillator, index) {
      isOscillatorConnected[index] && oscillator.disconnect(gainNode);
      isOscillatorConnected[index] = false;
    });
  }

  GAME.changeVolume = function(volumeStep) {
    var gain = gainNode.gain,
      value = gain.value,
      newValue = value + volumeStep;

      if (newValue < 0) {
        newValue = 0
      } else if (newValue > 1) {
        newValue = 1;
      }

      gain.value = newValue;
  }

  GAME.createSound = function(soundData, waveType, loop, notesAtATime) {
    var oscillators = getOscillators(notesAtATime, waveType),
      isOscillatorConnected = [],
      betweenNotesPause = [1];

    soundData = soundData.reduce(function(memo, expression) {
      memo.push(expression);
      memo.push(betweenNotesPause);

      return memo;
    }, []);

    var currentExpression = null,
      currentExpressionIndex = 0,
      currentExpressionValue = 0,
      expressionPlaying = false;

    function setCurrentExpression(nextExpressionIndex) {
      currentExpressionIndex = nextExpressionIndex || 0;

      var expression = soundData[currentExpressionIndex];

      currentExpression = {
        value: expression[0],
        notes: expression.slice(1, expression.length)
      }
    }

    function playExpression(delta) {
      if (!expressionPlaying) {
        expressionPlaying = true;
        playNotes(currentExpression.notes, oscillators, isOscillatorConnected);
      }

      currentExpressionValue += delta;
    }

    return {
      loop: loop,
      frozen: false,
      play: function(delta) {
        var self = this,
          nextExpressionIndex;

        if (this.frozen) {
          return;
        }

        if (currentExpression) {
          if (currentExpressionValue > currentExpression.value) {
            expressionPlaying = false;
            currentExpressionValue = 0;

            nextExpressionIndex = currentExpressionIndex + 1;

            if (soundData[nextExpressionIndex]) {
              setCurrentExpression(nextExpressionIndex);
              disconnectOscillators(oscillators, isOscillatorConnected);
            } else if (this.loop) {
              this.stop();
              setCurrentExpression();
            } else {
              this.frozen = true;
              this.stop();
              return;
            }
          }
        } else {
          setCurrentExpression();
        }

        playExpression(delta);
      },

      freeze: function() {
        this.frozen = true;
      },

      unfreeze: function() {
        this.frozen = false;
      },

      stop: function() {
        currentExpression = null;
        currentExpressionIndex = 0;
        currentExpressionValue = 0;
        expressionPlaying = false;

        disconnectOscillators(oscillators, isOscillatorConnected);
      }
    };
  }
})(GAME);
