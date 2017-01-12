describe 'Included concerns listing', ->

  it 'should be correct', ->
    CFoo = {}
    CBar = {}
    CBaz = {}

    class Foo
      @include CFoo
      @include CBaz

    class Bar extends Foo
      @include CBaz
      @include CBar

    class Baz
      @include CBar
      @include CBaz

    expect(Foo.concerns).toEqual [CFoo, CBaz]
    expect(Bar.concerns).toEqual [CFoo, CBaz, CBar]
    expect(Baz.concerns).toEqual [CBar, CBaz]
    expect(Concerns.includes(Baz, CBar)).toBe(true)
    expect(Concerns.includes(Bar, CBaz)).toBe(true)
