import { test, expect } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

const branch = process.env.CI_COMMIT_BRANCH || 'develop'

if(!branch) throw new Error('CI_COMMIT_BRANCH is not defined')

const envFilePath = path.resolve(`.env.${branch}`)

const result = dotenv.config({
  path: envFilePath
})

if (result.error) throw result.error

const host = process.env.VITE_HOST

if(!host) throw new Error('VITE_HOST is not defined')

test('login', async ({ page }) => {
  page.setViewportSize({ width: 375, height: 812 })
  await page.goto('http://localhost:5173/login')
  await expect(page).toHaveTitle('Demo')
  await page.waitForLoadState('networkidle')
  await page.locator('body').click({
    position: {
      x: 68,
      y: 396
    }
  })
  await page.waitForTimeout(5000)
  await page.fill('[data-testid="username"] input', 'test_register4')
  await page.fill('[data-testid="password"] input', 'test_register44')
  await page.locator('[data-testid="btn-login"]').click()
})