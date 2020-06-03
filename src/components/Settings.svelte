<script>
  import game from '../stores/game.js'
  import SwitchToggle from './SwitchToggle.svelte'

  const MAX_X = 24
  const MAX_Y = 24

  let flagless = false

  $: x = x || 8
  $: y = y || 8
  $: mines = 10
  $: preset = 'Easy'

  const submit = () => {
    if (!(x && y && mines)) return
    const maxMines = x * y - (x + y + 1)
    const _x = x >= 8 ? (x <= MAX_X ? x : MAX_X) : 8
    const _y = y >= 8 ? (y <= MAX_Y ? y : MAX_Y) : 8
    const _mines = mines >= 10 ? (mines <= maxMines ? mines : maxMines) : 10

    game.resetGame({
      x: _x,
      y: _y,
      mines: _mines,
      flagless,
    })
  }

  const setPreset = (presetX, presetY, presetMines) => {
    if (!presetX || !presetY || !presetMines) {
      preset = 'Custom'
    } else {
      x = presetX
      y = presetY
      mines = presetMines
    }
  }
</script>

<style>
  .settings {
    padding: 2rem;
  }

  .setting {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0 10px;
  }

  .setting__input {
    flex: 1;
    height: 25px;
    text-align: center;
    border: 1px solid #444;
  }

  .newGame {
    padding: 1rem;
    width: 100%;
    background-color: #444;
    border: none;
    color: white;
    text-transform: uppercase;
    font-weight: 900;
    cursor: pointer;
    margin-top: 50px;
  }

  .newGame:hover {
    background-color: #333;
  }

  .setting__name {
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 700;
    margin-right: 10px;
  }

  .setting__info {
    font-size: 12px;
    font-style: italic;
    font-weight: 300;
    text-transform: none;
  }
  .setting__gridSeparator {
    margin: 0 15px;
  }

  .preset__input {
    display: none;
  }

  .preset__label {
    border: 1px solid #333;
    padding: 0.2rem 0.5rem;
    font-size: 10px;
    cursor: pointer;
  }

  .preset__input:checked + label {
    background-color: #333;
    color: white;
  }
</style>

<div class="settings">
  <span class="setting__name">
    Grid size
    <span class="setting__info">(max. {MAX_X} x {MAX_Y})</span>
  </span>
  <div class="setting">
    <input
      id="preset-easy"
      class="preset__input"
      type="radio"
      value="Easy"
      bind:group={preset} />
    <label
      class="preset__label"
      for="preset-easy"
      on:click={() => setPreset(8, 8, 10)}>
      EASY
    </label>

    <input
      id="preset-medium"
      class="preset__input"
      type="radio"
      value="Medium"
      bind:group={preset} />
    <label
      class="preset__label"
      for="preset-medium"
      on:click={() => setPreset(16, 16, 40)}>
      MEDIUM
    </label>

    <input
      id="preset-hard"
      class="preset__input"
      type="radio"
      value="Hard"
      bind:group={preset} />
    <label
      class="preset__label"
      for="preset-hard"
      on:click={() => setPreset(24, 24, 120)}>
      HARD
    </label>

    <input
      id="preset-custom"
      class="preset__input"
      type="radio"
      value="Custom"
      bind:group={preset} />
    <label class="preset__label" for="preset-custom">CUSTOM</label>
  </div>
  <div class="setting">
    <input
      class="setting__input"
      type="number"
      min="8"
      max={MAX_X}
      on:change={() => setPreset()}
      bind:value={x} />
    <span class="setting__gridSeparator">x</span>
    <input
      class="setting__input"
      type="number"
      min="8"
      max={MAX_Y}
      on:change={() => setPreset()}
      bind:value={y} />
  </div>

  <span class="setting__name">
    MINES
    <span class="setting__info">(max. {x * y - (x + y + 1)})</span>
  </span>
  <div class="setting">
    <input
      class="setting__input"
      type="number"
      min="10"
      max={x * y - (x + y + 1)}
      on:change={() => setPreset()}
      bind:value={mines} />
  </div>
  <span class="setting__name">FLAGLESS MODE</span>
  <SwitchToggle bind:isActive={flagless} />
  <button class="newGame" type="button" on:click={submit}>New game</button>
</div>
