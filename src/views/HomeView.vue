<template>
  <div class="date-picker-wrapper">
    <img :src="logo" class="logo" />

    <div v-if="label" class="date-picker-label">
      {{ label }}
    </div>

    <VueDatePicker
      v-model="date"
      :min-date="minDate || now"
      :max-date="maxDate"
      :teleport-center="true"
      :format="formatPickerDate"
      :placeholder="placeholder"
      :clearable="true"
      :is24="true"
      @open="isCalendarOpened = true"
      @closed="isCalendarOpened = false"
      :enable-time-picker=" format !== 'date' "
      :time-picker=" format === 'time' "
      :min-time="{ hours: 0, minutes: 0, seconds: 0 }"
      :max-time="{ hours: 23, minutes: 59, seconds: 59 }"
      :year-range="[now.getFullYear(), now.getFullYear() + 12]"

      locale="ru"
      select-text="Выбрать"
      cancel-text="Отмена"

      :menu-class-name="`date-picker__menu ${colorScheme}`"
      :input-class-name="`date-picker__input ${colorScheme}`"
      :calendar-class-name="`date-picker__calendar ${colorScheme}`"
      :calendar-cell-class-name="`date-picker__calendar-cell ${colorScheme}`"
    />

    <div v-if="isCalendarOpened" class="date-picker-backdrop" />
  </div>
</template>

<script lang="ts" setup>

import { computed, onMounted, ref, watch } from "vue";
import { DateTime } from "luxon";
import { useRouteQuery } from "@vueuse/router";
import { useWebApp, useWebAppMainButton, useWebAppTheme } from "vue-tg";
import VueDatePicker from "@vuepic/vue-datepicker";
import logo from "@/assets/logo.svg";

const { showMainButton, hideMainButton, setMainButtonParams, mainButtonColor } = useWebAppMainButton();
const { onEvent, sendData } = useWebApp();
const { colorScheme } = useWebAppTheme();

const date = ref();
const isCalendarOpened = ref<boolean>(false);
const now = ref(new Date());

const minDateFromQuery = useRouteQuery("min", undefined);
const maxDateFromQuery = useRouteQuery("max", undefined);
const placeholder = useRouteQuery("placeholder", undefined);
const label = useRouteQuery("label");
const format = useRouteQuery<"date" | "time" | "datetime">("format", "datetime");

const formatPickerDate = (date: string | Date | Date[]): string => {
  if (typeof date != "string") {
    if (Array.isArray(date))
      throw new Error("Multiple dates are not allowed");
    else {
      return DateTime.fromJSDate(date).toFormat(formatString.value);
    }
  }

  return date;
};

const getDateValue = (rawDate?: string) => {
  if (rawDate) {
    const luxonDate = DateTime.fromISO(rawDate);

    if (luxonDate.isValid) {
      return luxonDate.toJSDate();
    }
  }

  return undefined;
};

const minDate = computed(() => getDateValue(minDateFromQuery.value));
const maxDate = computed(() => getDateValue(maxDateFromQuery.value));
const formatString = computed(() => {
  switch (format.value) {
    case "date":
      return "dd.LL.y";
    case "time":
      return "HH:mm";
    default:
      return "dd.LL.y HH:mm";
  }
});

onEvent("mainButtonClicked", () => {
  let sendValue: any;

  if (date.value) {
    let luxonDate: DateTime | undefined;

    if (date.value instanceof Date) {
      luxonDate = DateTime.fromJSDate(date.value);
    }

    if (
      (luxonDate && luxonDate.isValid) ||
      (typeof date.value === "object" && format.value === "time")
    ) {
      switch (format.value) {
        case "datetime":
          sendValue = luxonDate!.toFormat("y-LL-dd HH:mm:ss");
          break;
        case "date":
          sendValue = luxonDate!.toFormat("y-LL-dd");
          break;
        case "time":
          const { hours, minutes, seconds } = date.value;

          sendValue = [ hours, minutes, seconds ].map(v => `${v}`.padStart(2, "0")).join(":");
          break;
      }
    }

    sendData(
      JSON.stringify({
        value: sendValue,
        format: format.value
      })
    );
  }
});

watch(date, value => {
  if (value) {
    showMainButton();
  } else {
    hideMainButton();
  }
});

onMounted(() => {
  setMainButtonParams({
    text: "Выбрать",
    color: "#e27e39",
    text_color: "#fff"
  });
});
</script>


<style lang="postcss">
.date-picker-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
  max-width: 50rem;
  margin: 0 auto;
}

.logo {
  width: 36rem;
  opacity: 0.05;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(calc(-50% + 8rem), calc(-50% - 7rem));
}

.date-picker-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(122, 122, 122, 0.3);
  backdrop-filter: blur(3px) saturate(1.2);
  transition: all 0.3s;
}

.date-picker-label {
  margin-bottom: 1rem;
  color: var(--tg-theme-text-color, #000);
  font-size: 1.9rem;
}

.date-picker__menu {
  & .dp__selection_preview {
    font-size: 1.2rem;
  }

  & .dp__action_row {
    & .dp__action_buttons {
      & button {
        font-size: 1.2rem;
        padding: 1rem;

        &.dp__action_select {
          color: #fff;
          background: var(--app-accent-color);
        }

        &.dp__action_cancel {
          &:hover {
            border-color: var(--app-accent-color);
          }
        }
      }
    }
  }

  .dp__overlay_cell_active {
    color: #fff;
    background: var(--app-accent-color);
  }

  .dp__time_input {
    .dp__time_display {
      font-size: 3.6rem;
      width: 5rem;
      height: 5rem;
      line-height: 5rem;
    }
  }

  &.dark {
    background: var(--tg-theme-secondary-bg-color);
    color: var(--tg-theme-text-color);
    border-color: var(--tg-theme-bg-color);

    .dp__instance_calendar,
    .dp__overlay {
      background: var(--tg-theme-secondary-bg-color);

      .dp__overlay_cell {
        color: var(--tg-theme-text-color);

        &:hover {
          &:not(.dp__overlay_cell_active) {
            background: var(--tg-theme-bg-color);
          }
        }

        &.dp__overlay_cell_disabled {
          background: var(--tg-theme-bg-color);
          color: var(--tg-theme-text-color);
          opacity: 0.3;
        }
      }
    }

    .dp__month_year_wrap {
      & button {
        color: var(--tg-theme-text-color);

        & .dp__inner_nav {
          &:hover {
            background: var(--tg-theme-bg-color);
          }
        }
      }
    }

    .dp__time_input {
      .dp__time_display {
        color: var(--tg-theme-text-color);

        &:hover {
          background: var(--tg-theme-bg-color);
        }
      }

      .dp__inc_dec_button {
        &:hover {
          color: var(--app-accent-color);
        }
      }
    }

    .dp__time_col {
      color: var(--tg-theme-hint-color);
    }

    .dp__btn {
      &:hover {
        background: var(--tg-theme-bg-color);
      }
    }

    & .dp__selection_preview {
      color: var(--tg-theme-hint-color);
    }

    & .dp__action_row {
      & .dp__action_buttons {
        & button {
          &.dp__action_select {
            color: var(--tg-theme-text-color);
            background: var(--app-accent-color);
          }

          &.dp__action_cancel {
            color: var(--tg-theme-hint-color);
            border-color: var(--tg-theme-hint-color);

            &:hover {
              border-color: var(--app-accent-color);
              color: var(--tg-theme-text-color);
            }
          }
        }
      }
    }
  }
}

.date-picker__input {
  &.dark {
    background: var(--tg-theme-bg-color, #fff);
    color: #959595FF;
    border-color: #959595FF;

    &::placeholder {
      color: var(--tg-theme-hint-color);
    }
  }
}

.date-picker__calendar {
  &.dark {
    & .dp__calendar_header {
      color: var(--tg-theme-text-color);
      border-color: var(--tg-theme-bg-color);
    }
  }
}

.date-picker__calendar-cell {
  &.dark {
    color: var(--tg-theme-text-color) !important;

    &:not(.dp__today) {
      &:not(.dp__active_date) {
        &:hover {
          background: var(--tg-theme-bg-color) !important;
        }
      }

      &.dp__today {
        border-color: var(--app-accent-color) !important;
      }

      &.dp__cell_disabled,
      &.dp__cell_offset {
        color: var(--tg-theme-hint-color) !important;
      }

      &.dp__cell_disabled {
        opacity: 0.5;
      }
    }
  }

  &.dp__today {
    border-color: var(--app-accent-color) !important;
  }

  &.dp__active_date,
  &.dp__active_date:hover,
  &.dp__today:hover {
    background: var(--app-accent-color) !important;
  }
}
</style>