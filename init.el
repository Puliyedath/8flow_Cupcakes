;;; package --- Summary
;;; Commentary:

;;; Code:
;; adds melpa-stable to the list of repos
(require 'package)
(setq package-archives '(("melpa-stable" . "https://stable.melpa.org/packages/")
			 ("gnu" . "https://elpa.gnu.org/packages/")
			 ("org" . "https://orgmode.org/elpa/")))
(package-initialize)

;; remove menu bar
(menu-bar-mode -1)

;; python-mode v split to a file
(use-package python-mode
  :ensure t
  :hook (python-mode . (lambda ()
                         (setq tab-width 4)
                         (setq python-indent-offset 4)
                         (setq indent-tabs-mode nil))))

(use-package typescript-mode
  :ensure t
  :hook (typescript-mode . (lambda ()
                             (setq tab-width 2)
                             (setq typescript-indent-level 2)
                             (setq indent-tabs-mode nil))))

;; flycheck mode
;; load after lsp-mode
(use-package flycheck
  :ensure t
  :after (lsp-mode)
  :init
  (global-flycheck-mode))

;; reformatter helps to define custom format for files
;; this is used to thread prettier formatter to the files
;; use this package to thread all file formatters in future
(use-package reformatter
  :ensure t)

;;; this is a macro that constructs the functions
;;; prettier-format-buffer and prettier-format-region
(reformatter-define  prettier-format
		     :program "prettier"
		     :args (list "--stdin-filepath" (or buffer-file-name ""))
		     :stdin t)

;; lsp-mode installation
;; disabling lsp checker with diagnostics
(use-package lsp-mode
  :config
  (setq lsp-prefer-flymake nil)
  :ensure t
  :hook ((typescript-mode . lsp)
	 (typescript-mode . (lambda () (add-hook 'before-save-hook #'prettier-format-buffer nil t)))
	 (java-mode . lsp)
	 (python-mode . lsp)
         (js-mode . lsp)
         (js2-mode . lsp)
         (web-mode . lsp))
  :commands lsp)

;; lsp-java has lsp-docker dependency
;; which is not available in repos any more
;; (use-package lsp-java
;;   :ensure t
;;   :config (add-hook 'java-mode-hook 'lsp))


;; add flycheck as the diagnostics provider
;; we are disable all lsp-formatting in the buffer
;; this is going to effect other languages
(with-eval-after-load 'lsp-mode
  (setq lsp-clients-typescript-format-options nil)  ;; disable typescript formatting
  (setq lsp-enable-on-type-formatting nil)
  (setq lsp-enable-indentation nil)
  (setq lsp-enable-format-on-save nil)
  (setq lsp-diagnostics-provider :flycheck))

(use-package lsp-ui
  :ensure t
  :commands lsp-ui-mode
  :config
  (setq lsp-ui-sideline-enable t
	lsp-ui-sideline-show-diagnostics t))

(use-package company
  :ensure t
  :config
  (add-hook 'after-init-hook 'global-company-mode))


;; installing microsoft server
;; lsp-pyright-venv-path is where emacs will look
;; for virtual envs
(use-package lsp-pyright
  :ensure t
  :hook (python-mode . (lambda ()
			 (require 'lsp-pyright)
			 (setq lsp-pyright-use-library-code-for-types t)
			 (lsp))) ;or lsp-deferred
  :config
  (setq lsp-pyright-auto-import-completions t
	lsp-pyright-disable-organize-imports nil
	lsp-pyright-multi-root nil
	lsp-pyright-venv-path "~/my_venvs"))



;; theme
(use-package gruvbox-theme
  :ensure t
  :config
  (load-theme 'gruvbox-dark-medium t))
;; (load-theme 'manoj-dark)

;; fido-vertical-mode
(fido-vertical-mode)

;; KEY BINDINGS
(global-set-key (kbd "M-p") 'previous-buffer)
(global-set-key (kbd "M-n") 'next-buffer)


(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(package-selected-packages
   '(typescript-mode gruvbox-theme lsp-pyright company lsp-ui lsp-mode reformatter flycheck python-mode)))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
