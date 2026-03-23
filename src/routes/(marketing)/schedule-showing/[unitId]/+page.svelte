<script>
  import { track } from '$lib/analytics';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import { ROUTES } from '$lib/config/routes.js';
  import Head from '$lib/seo/Head.svelte';

  /** @type {any} */
  let { data = {}, form = null } = $props();

  const unit = data.selectedUnit;
  const unitLabel = unit?.unitName ?? unit?.id ?? 'Unit';

  /** @type {'slots' | 'contact' | 'done'} */
  let step = $state('slots');
  /** @type {any} */
  let selectedSlot = $state(null);

  $effect(() => {
    if (form?.success) {
      step = 'done';
    } else if (form?.errors?.length) {
      step = 'contact';
    }
  });

  const slotsByDate = $derived.by(() => {
    const slots = data.showingSlots ?? [];
    /** @type {Record<string, any[]>} */
    const byDate = {};
    for (const s of slots) {
      const d = s.date ?? '';
      if (!byDate[d]) byDate[d] = [];
      byDate[d].push(s);
    }
    for (const k of Object.keys(byDate)) {
      byDate[k].sort((a, b) => (a.startTime ?? '').localeCompare(b.startTime ?? ''));
    }
    return Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b));
  });

  const hiddenDatetime = $derived(
    form?.datetime ?? (selectedSlot ? slotDatetime(selectedSlot) : '')
  );

  /**
   * Maynard sends HH:mm or HH:mm:ss — show as 12-hour for the UI only.
   * @param {string | null | undefined} timeStr
   * @returns {string}
   */
  function formatTime12h(timeStr) {
    if (timeStr == null || String(timeStr).trim() === '') return '—';
    const parts = String(timeStr).trim().split(':');
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1] ?? '0', 10);
    if (Number.isNaN(h) || Number.isNaN(m)) return String(timeStr);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
  }

  /** @param {string} isoLocal datetime sent to API, e.g. 2025-03-15T14:30:00 */
  function formatSelectedTimeForDisplay(isoLocal) {
    if (!isoLocal) return '';
    const d = new Date(isoLocal);
    if (Number.isNaN(d.getTime())) {
      const [datePart, rest] = isoLocal.split('T');
      const hhmm = rest?.slice(0, 5) ?? '';
      return `${formatDateHeading(datePart)} at ${formatTime12h(hhmm)}`;
    }
    const dateLine = d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    const timeLine = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${dateLine} at ${timeLine}`;
  }

  /** @param {any} slot */
  function staffLabel(slot) {
    const n = slot.assignedStaff?.name ?? slot.assignedStaffName;
    return n ? `with ${n}` : '';
  }

  /** @param {any} slot */
  function slotDatetime(slot) {
    const t = slot.startTime ?? '09:00';
    const timePart = t.split(':').length >= 3 ? t : `${t}:00`;
    return `${slot.date}T${timePart}`;
  }

  /** @param {any} slot */
  function pickSlot(slot) {
    if (slot.available === false) return;
    selectedSlot = slot;
    step = 'contact';
    track('ScheduleTour', {
      unit_id: unit?.id ?? unit?.unitId,
      stage: 'slot_selected',
    });
  }

  /** @param {string} isoDate */
  function formatDateHeading(isoDate) {
    if (!isoDate) return '';
    const d = new Date(`${isoDate}T12:00:00`);
    if (Number.isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  function goBackToSlots() {
    step = 'slots';
    selectedSlot = null;
  }

  const bookingIdDisplay = $derived(
    form?.bookingId != null && form?.bookingId !== ''
      ? String(form.bookingId)
      : form?.booking?.id != null
        ? String(form.booking.id)
        : null
  );
</script>

<Head
  pageTitle="Schedule a Tour | Atrium Court"
  {data}
  description="Pick a time and book an in-person tour at Atrium Court."
/>

<Header />

<main class="min-h-screen bg-[#D8E8EF]/30">
  <section class="pt-10 pb-6 md:pt-14 md:pb-10">
    <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-3xl">
      <p class="text-sm text-atrium-navy/70 mb-2">
        <a href={ROUTES.AVAILABILITY} class="underline font-medium hover:text-[#0099e5]"
          >← Back to availability</a
        >
      </p>
      <h1 class="text-3xl md:text-4xl font-bold text-atrium-navy tracking-tight">
        Schedule a tour
      </h1>
      <p class="mt-2 text-atrium-navy/80 text-lg">Unit {unitLabel}</p>
    </div>
  </section>

  <section class="pb-16 md:pb-24">
    <div class="container mx-auto px-4 md:px-6 lg:px-8 max-w-3xl">
      {#if step === 'done' && form?.success}
        <div
          class="bg-white rounded-2xl shadow-[0_8px_30px_rgba(21,16,40,0.08)] border border-atrium-navy/5 p-8 md:p-10"
        >
          <h2 class="text-xl font-bold text-atrium-navy">You’re all set</h2>
          <p class="mt-3 text-atrium-navy/80">
            Your tour request has been submitted. We’ll confirm by phone or email.
          </p>
          {#if bookingIdDisplay}
            <p class="mt-4 text-sm text-atrium-navy/70">
              Reference: <span class="font-mono">{bookingIdDisplay}</span>
            </p>
          {/if}
          <div class="mt-8 flex flex-wrap gap-4">
            <a
              href={ROUTES.AVAILABILITY}
              class="btn-atrium-primary px-6 py-3 rounded-xl font-semibold">View availability</a
            >
            <a
              href={ROUTES.CONTACT_US}
              class="inline-flex items-center px-6 py-3 rounded-xl font-semibold border border-atrium-navy/20 text-atrium-navy hover:bg-atrium-navy/5"
              >Contact leasing</a
            >
          </div>
        </div>
      {:else if step === 'contact'}
        <div
          class="bg-white rounded-2xl shadow-[0_8px_30px_rgba(21,16,40,0.08)] border border-atrium-navy/5 p-6 md:p-8 lg:p-10"
        >
          <button
            type="button"
            class="text-sm font-semibold text-[#0099e5] hover:underline mb-6"
            onclick={goBackToSlots}
          >
            ← Choose a different time
          </button>

          {#if hiddenDatetime}
            <p class="text-sm text-atrium-navy/80 mb-6">
              <span class="font-semibold text-atrium-navy">Selected time:</span>
              {formatSelectedTimeForDisplay(hiddenDatetime)}
            </p>
          {/if}

          {#if form?.errors?.length}
            <div
              class="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-red-700 text-sm mb-6"
            >
              <ul class="list-none space-y-1">
                {#each form.errors as err (err)}
                  <li>• {err}</li>
                {/each}
              </ul>
            </div>
          {/if}

          <form method="POST" action="?/book" class="space-y-6">
            <input type="hidden" name="datetime" value={hiddenDatetime} />
            <input
              type="hidden"
              name="assignedUserId"
              value={selectedSlot?.assignedUserId ?? form?.assignedUserId ?? ''}
            />

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label for="firstName" class="block text-sm font-semibold text-atrium-navy mb-2"
                  >First name *</label
                >
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={form?.firstName ?? ''}
                  autocomplete="given-name"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-atrium-navy focus:border-[#0099e5] focus:bg-white focus:ring-2 focus:ring-[#0099e5]/20 outline-none"
                />
              </div>
              <div>
                <label for="lastName" class="block text-sm font-semibold text-atrium-navy mb-2"
                  >Last name *</label
                >
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={form?.lastName ?? ''}
                  autocomplete="family-name"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-atrium-navy focus:border-[#0099e5] focus:bg-white focus:ring-2 focus:ring-[#0099e5]/20 outline-none"
                />
              </div>
            </div>

            <div>
              <label for="phoneNumber" class="block text-sm font-semibold text-atrium-navy mb-2"
                >Phone *</label
              >
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                value={form?.phoneNumber ?? ''}
                autocomplete="tel"
                class="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-atrium-navy focus:border-[#0099e5] focus:bg-white focus:ring-2 focus:ring-[#0099e5]/20 outline-none"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-semibold text-atrium-navy mb-2"
                >Email</label
              >
              <input
                id="email"
                name="email"
                type="email"
                value={form?.email ?? ''}
                autocomplete="email"
                class="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-atrium-navy focus:border-[#0099e5] focus:bg-white focus:ring-2 focus:ring-[#0099e5]/20 outline-none"
              />
            </div>

            <div>
              <label for="notes" class="block text-sm font-semibold text-atrium-navy mb-2"
                >Notes <span class="font-normal text-atrium-navy/60">(optional)</span></label
              >
              <textarea
                id="notes"
                name="notes"
                rows="3"
                class="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-atrium-navy focus:border-[#0099e5] focus:bg-white focus:ring-2 focus:ring-[#0099e5]/20 outline-none resize-none"
                >{form?.notes ?? ''}</textarea
              >
            </div>

            <button
              type="submit"
              class="btn-atrium-primary w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold"
            >
              Confirm tour
            </button>
          </form>
        </div>
      {:else if slotsByDate.length === 0}
        <div
          class="bg-white rounded-2xl shadow-[0_8px_30px_rgba(21,16,40,0.08)] border border-atrium-navy/5 p-8 md:p-10 text-center"
        >
          <p class="text-atrium-navy/90 text-lg">
            No available times in the next 14 days for online booking.
          </p>
          <p class="mt-2 text-sm text-atrium-navy/70">
            Our team can still help you schedule—reach out anytime.
          </p>
          <a
            href={ROUTES.CONTACT_US}
            class="inline-block mt-6 btn-atrium-primary px-8 py-3 rounded-xl font-semibold"
          >
            Contact us
          </a>
        </div>
      {:else}
        <div class="space-y-10">
          {#each slotsByDate as [dateKey, slots] (dateKey)}
            <div>
              <h2 class="text-lg font-bold text-atrium-navy mb-4">
                {formatDateHeading(dateKey)}
              </h2>
              <div class="flex flex-wrap gap-2">
                {#each slots as slot, i (slot.id ?? `${dateKey}-${slot.startTime}-${i}`)}
                  {@const disabled = slot.available === false}
                  <button
                    type="button"
                    {disabled}
                    onclick={() => pickSlot(slot)}
                    class="rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-45 disabled:cursor-not-allowed {disabled
                      ? 'border-gray-200 text-atrium-navy/50 bg-gray-50'
                      : 'border-atrium-navy/15 text-atrium-navy bg-white hover:border-[#0099e5] hover:text-[#0099e5] shadow-sm'}"
                  >
                    {formatTime12h(slot.startTime)}
                    {#if staffLabel(slot)}
                      <span class="block text-xs font-normal text-atrium-navy/70 mt-0.5">
                        {staffLabel(slot)}
                      </span>
                    {/if}
                  </button>
                {/each}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </section>
</main>

<Footer />
