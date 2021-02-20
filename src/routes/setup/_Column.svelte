<script lang="ts">
  import { getAnswers } from "@/lib/answer";
  import type { KanaCheckboxRow } from "@/stores/configKana";
  import KanaCheckbox from "./_KanaCheckbox.svelte";
  import KanaCheckboxSpacer from "./_KanaCheckboxSpacer.svelte";
  import { playCheckboxSelectSeriesSound } from "@/lib/sound";
  import Checkbox from "../../components/Checkbox.svelte";

  export let rows: KanaCheckboxRow[];
  export let label: string;

  function isRowSelected(row: KanaCheckboxRow): boolean {
    return row.filter((item) => item !== null).every((item) => item.checked);
  }

  function selectRow(state: boolean) {
    return function (row: KanaCheckboxRow) {
      return row.map((item) =>
        item !== null ? { ...item, checked: state } : null
      );
    };
  }
</script>

<section class="column" aria-label={label}>
  <div class="row select-all">
    <!-- svelte-ignore a11y-label-has-associated-control -->
    <label>
      <Checkbox
        checked={rows.every(isRowSelected)}
        on:click={() => {
          const everyRowChecked = rows.every(isRowSelected);
          rows = rows.map(selectRow(!everyRowChecked));

          playCheckboxSelectSeriesSound(8, !everyRowChecked);
        }}
      />
      <span>Select all</span>
    </label>
  </div>
  {#each rows as row}
    <div
      class="row"
      role="row"
      aria-label={getAnswers(row[0].kana)[0].slice(0, row[0].kana.length) +
        "- sounds"}
    >
      <Checkbox
        title="Select row"
        checked={isRowSelected(row)}
        indeterminate={!isRowSelected(row) &&
          row.filter((item) => item !== null).some((item) => item.checked)}
        on:click={() => {
          const newState = !isRowSelected(row);
          const diffItems = row.filter(
            (item) => item && item.checked !== newState
          );
          const toPlay = Math.min(diffItems.length, 4);

          playCheckboxSelectSeriesSound(toPlay, newState);
          row = selectRow(newState)(row);
        }}
      />
      {#each row as item, index}
        {#if item}
          <KanaCheckbox bind:item rowIndex={index} rowLength={row.length} />
        {:else}
          <KanaCheckboxSpacer />
        {/if}
      {/each}
    </div>
  {/each}
</section>

<style lang="scss">
  .column {
    display: inline-block;
  }

  .select-all {
    user-select: none;
    margin-bottom: 1.25em;
    font-weight: 500;
  }

  .select-all label {
    display: flex;
    flex-direction: row;
    cursor: pointer;
    align-items: center;
  }

  .select-all label span {
    margin-left: 10px;
  }

  .row {
    display: flex;
    align-items: center;

    &:not(:first-of-type):not(.select-all) {
      margin-top: 10px;
    }
  }

  // checkbox
  .row :global(input[type="checkbox"]) {
    margin-right: 10px;
    font-size: 1.25em;
  }

  // kana
  .row > :global(*:not(:first-child)) {
    margin-left: 10px;
  }
</style>