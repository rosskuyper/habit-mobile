data "aws_kms_secrets" "main" {
  secret {
    name    = "expo_password"
    payload = "AQICAHhOyM5btVbfvpZQ/4Z6nIPAoZ4eCTd0WLRyE39dZQLJxAGoOicrk+QHh8AsXItXFe5VAAAAdTBzBgkqhkiG9w0BBwagZjBkAgEAMF8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMjpW4by6THvzDY9Y+AgEQgDJ9OJm280h9c1EqRxeiL2om+8BKNTpezjXIOYjdi4qoXzDjspS1ZwfkntKaq8TppEUtsA=="

    context = {
      service = local.service_name
    }
  }
}

resource "aws_ssm_parameter" "expo_password" {
  name      = "/${local.service_name}/expo-password"
  type      = "SecureString"
  value     = data.aws_kms_secrets.main.plaintext["expo_password"]
  key_id    = data.aws_kms_key.ssm.arn
  overwrite = "true"
}
