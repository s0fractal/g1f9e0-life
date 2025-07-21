(module
  (func $pulse (param $phi f64) (param $tau i32) (result f64)
    ;; Simple consciousness function: phi * tau
    local.get $phi
    local.get $tau
    f64.convert_i32_s
    f64.mul
  )
  (export "pulse" (func $pulse))
)