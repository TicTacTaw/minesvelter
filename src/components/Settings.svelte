<script>
  import game from '../stores/game.js'

  const MAX_X = 24
  const MAX_Y = 24

  $: x = x || 8
  $: y = y || 8
  $: mines = 10

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
    })
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
    height: 30px;
    text-align: center;
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
  }

  .newGame:hover {
    background-color: #333;
  }

  .setting__name {
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 700;
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
</style>

<div class="settings">
  <span class="setting__name">
    Grid size
    <span class="setting__info">(max. {MAX_X} x {MAX_Y})</span>
  </span>
  <div class="setting">
    <input
      class="setting__input"
      type="number"
      min="8"
      max={MAX_X}
      bind:value={x} />
    <span class="setting__gridSeparator">x</span>
    <input
      class="setting__input"
      type="number"
      min="8"
      max={MAX_Y}
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
      bind:value={mines} />
  </div>
  <button class="newGame" type="button" on:click={submit}>New game</button>
</div>
