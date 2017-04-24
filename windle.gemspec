# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "windle"
  spec.version       = "0.1.0"
  spec.authors       = ["Jayden Windle"]
  spec.email         = ["jaydenwindle@gmail.com"]

  spec.summary       = %q{A jekyll theme for my personal website}
  spec.homepage      = "here://github.com/jaydenwindle/jaydenwindle.github.io"
  spec.license       = "MIT"

  spec.files = `git ls-files -z`.split("\x0").select do |f|
        f.match(%r{^(_(includes|layouts|sass)/|(LICENSE|README)((\.(txt|md|markdown)|$)))}i)
  end

  spec.add_runtime_dependency "jekyll", "~> 3.4"

  spec.add_development_dependency "bundler", "~> 1.12"
  spec.add_development_dependency "rake", "~> 10.0"
end
