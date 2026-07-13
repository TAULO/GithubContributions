<script lang="ts">
   const { contributions } = $props();

   console.log(contributions);

   const months = [
       'Jan',
       'Feb',
       'Mar',
       'Apr',
       'May',
       'Jun',
       'Jul',
       'Aug',
       'Sep',
       'Oct',
       'Nov',
       'Dec',
   ];

   function getWeekDateFromIndex(index: number): string | null {
       if (index === 0) return null; // skip the first month

       const monthStr = contributions.weeks[index]?.[0]?.date;
       if (!monthStr) return null;

       const currentMonthIndex = new Date(monthStr).getMonth();
       if (index === 0) return months[currentMonthIndex] ?? null;

       const prevMonthStr = contributions.weeks[index - 1]?.[0]?.date;
       if (!prevMonthStr) return months[currentMonthIndex] ?? null;

       const prevMonthIndex = new Date(prevMonthStr).getMonth();
       if (currentMonthIndex === prevMonthIndex) return null;

       return months[currentMonthIndex] ?? null;
   }
</script>

<div class="container">
    {#each contributions.weeks as week, index}
        <div class="block">
            <p class="date">{getWeekDateFromIndex(index)}</p>
            {#each week as contribution}
                <div class={['cell', `level-${contribution.level}`]}>

                </div>
            {/each}
        </div>
    {/each}
</div>

<style>
    .container {
        display: flex;
        gap: 2px;

        padding-top: 24px;
        overflow-x: auto;
    }

    .block {
        position: relative;

        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .date {
        position: absolute;
        top: -24px;

        padding: 0;
        margin: 0;
    }

    .cell {
        width: 12px;
        height: 12px;
        border: 1px solid black;
        border-radius: 2px;
    }

    .level-1 {
        background-color: #007bff;
    }

    .level-2 {
        background-color: #28a745;
    }

    .level-3 {
        background-color: #ffc107;
    }

    .level-4 {
        background-color: #dc3545;
    }
</style>