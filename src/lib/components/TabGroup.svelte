<script lang="ts">
    export let tabNames: string[];
    export let activeTab: (typeof tabNames)[number] = tabNames[0];
    export let color: string = "";
    export let hasMobileDesign: boolean = false;
</script>

<div class="flex flex-col lg:rounded-lg {color} {$$restProps.class ?? ''}">
    <!-- Content -->
    <div class="flex-grow order-2">
        <slot name="content" />
    </div>

    <!-- Tabs -->
    <div
        class="{hasMobileDesign
            ? 'flex-grow sm:flex-grow-0 order-3 lg:order-1'
            : ''} flex"
    >
        {#each tabNames as tabName}
            <div
                class="{hasMobileDesign
                    ? 'flex-grow sm:flex-grow-0'
                    : ''} p-2 h-16 flex items-center text-center"
            >
                <slot
                    name="tab"
                    tab={tabName}
                    isActive={tabName === activeTab}
                />
            </div>
        {/each}
    </div>
</div>
