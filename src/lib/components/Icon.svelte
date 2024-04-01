<script lang="ts">
    export let icon: string;
    export let color: string = "currentColor";
</script>

<svg viewBox="0 0 24 24" class="" style="width: 1.5em;" {...$$restProps}>
    <g>
        <path d={icon} fill={color}></path>
    </g>
</svg>
