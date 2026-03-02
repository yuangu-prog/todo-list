---
name: code-review
description: 审查最近的代码变更
disable-model-invocation: true
---
审查代码变更：

1. 运行 `git diff` 查看所有变更
2. 检查代码是否符合 CLAUDE.md 中的编码规范
3. 检查是否有安全漏洞（SQL注入、XSS等）
4. 检查是否有性能问题
5. 检查测试覆盖率
6. 以列表形式输出发现的问题和建议
