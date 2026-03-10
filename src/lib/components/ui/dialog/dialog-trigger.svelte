<script lang="ts">
  import { Dialog as DialogPrimitive } from 'bits-ui';

  let { ref = $bindable(null), asChild, ...restProps }: DialogPrimitive.TriggerProps = $props();
</script>

<DialogPrimitive.Trigger bind:ref data-slot="dialog-trigger" {asChild} {...restProps} let:builder>
  <slot {builder} />
</DialogPrimitive.Trigger>
