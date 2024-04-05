type MaxLengthArray<T, N extends number> = N extends N ? number extends N ? T[] : _ArrayOfSize<T, N, []> : never;
type _ArrayOfSize<T, N extends number, R extends unknown[]> = R[ 'length' ] extends N ? R : _ArrayOfSize<T, N, [ T, ...R ]>;

type PropertyKeysOfType<T, V> = {
    [ K in keyof T ]: T[ K ] extends V ? K : never;
}[ keyof T ];
type PropertiesOf<T> = Pick<T, PropertyKeysOfType<T, unknown>>;
