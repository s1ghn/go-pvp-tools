<script lang="ts">
    import { base } from "$app/paths";
    import TabGroup from "$lib/components/TabGroup.svelte";
    import { page } from "$app/stores";
    import { mdiChevronTripleUp, mdiCog, mdiTextBoxSearch } from "@mdi/js";
    import Icon from "$lib/components/Icon.svelte";

    const mainRoutes = {
        search: {
            title: "League Search",
            icon: mdiChevronTripleUp,
            path: "",
        },
        queryBuilder: {
            title: "Query Builder",
            icon: mdiTextBoxSearch,
            path: "query-builder",
        },
        settings: {
            title: "Settings",
            icon: mdiCog,
            path: "settings",
        },
    };

    $: currentMainRoute =
        Object.entries(mainRoutes).find(
            ([name, setting]) =>
                $page.url.pathname === `${base}/${setting.path}`,
        )?.[0] ?? "";

    function getRoute(
        id: string,
    ): (typeof mainRoutes)[keyof typeof mainRoutes] {
        return mainRoutes[id as keyof typeof mainRoutes];
    }
</script>

<TabGroup
    tabNames={Object.keys(mainRoutes)}
    bind:activeTab={currentMainRoute}
    color="bg-stone-200 dark:bg-stone-800"
    hasMobileDesign
    class="flex-grow max-w-screen-2xl mx-auto"
>
    <div slot="tab" let:tab let:isActive class="w-full">
        {@const route = getRoute(tab)}
        <a
            href="{base}/{route.path}"
            class="block w-full text-center {isActive
                ? 'text-stone-950 dark:text-stone-50'
                : 'text-stone-400 dark:text-stone-500'}"
        >
            <Icon icon={route.icon}></Icon>

            <span class="hidden sm:inline">
                {route.title}
            </span>
        </a>
    </div>

    <div
        slot="content"
        class="flex flex-col h-[calc(100svh-4rem)] lg:h-[calc(100svh-6rem)]"
    >
        <slot name="header" />

        <div on:scroll class="overflow-auto">
            <slot />
        </div>
    </div>
</TabGroup>
