---
name: fix-issue
description: Fix a GitHub issue
disable-model-invocation: true
---
分析并修复 GitHub Issue: $ARGUMENTS

1. 使用 `gh issue view` 获取 issue 详情
2. 理解问题描述
3. 在代码库中搜索相关文件
4. 实现修复代码
5. 编写并运行测试验证修复
6. 确保代码通过 lint 和类型检查
7. 创建描述性的 commit message
8. 推送并创建 PR