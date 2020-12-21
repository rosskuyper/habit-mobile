data "aws_kms_secrets" "main" {
  secret {
    name    = "expo_password"
    payload = "AQICAHhOyM5btVbfvpZQ/4Z6nIPAoZ4eCTd0WLRyE39dZQLJxAGoOicrk+QHh8AsXItXFe5VAAAAdTBzBgkqhkiG9w0BBwagZjBkAgEAMF8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMjpW4by6THvzDY9Y+AgEQgDJ9OJm280h9c1EqRxeiL2om+8BKNTpezjXIOYjdi4qoXzDjspS1ZwfkntKaq8TppEUtsA=="

    context = {
      service = local.service_name
    }
  }

  secret {
    name    = "slack_webhook"
    payload = "AQICAHhOyM5btVbfvpZQ/4Z6nIPAoZ4eCTd0WLRyE39dZQLJxAHVnWCvYVcGJg10bOWubNMbAAAAszCBsAYJKoZIhvcNAQcGoIGiMIGfAgEAMIGZBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDHREuP4t0/okdQyKEwIBEIBs2++51Wh2YjVPzCndcMFAKi3QwzMV+bz7qLYl13AVKgE9qnRho5iUehd0+o8mL8wX1YntoAYNMfeYXnmr3Vyz6a7oUO5ap4LeoW2YhyXEJDxR90G6tBSfG2yZgDU399XQKfU7zLbTIpRTjzsj"

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

resource "aws_ssm_parameter" "slack_webhook" {
  name      = "/${local.service_name}/slack-webhook"
  type      = "SecureString"
  value     = data.aws_kms_secrets.main.plaintext["slack_webhook"]
  key_id    = data.aws_kms_key.ssm.arn
  overwrite = "true"
}
