"use client";
import { createContext, ReactNode, useContext, useState } from "react";

type ModalProps = {
  [key: string]: any;
};

type ModalState = {
  Component: React.ComponentType<any>;
  props: ModalProps;
};

type ModalContextType = {
  showModal: (Component: React.ComponentType<any>, props?: ModalProps) => void;
  hideModal: () => void;
  showLoading: (loading: boolean) => void;
  loading: boolean;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modals, setModals] = useState<ModalState[]>([]);
  const [loading, setLoading] = useState(false);

  const showModal = (
    Component: React.ComponentType<any>,
    props: ModalProps = {}
  ) => {
    setModals((prev) => [...prev, { Component, props }]);
  };

  const hideModal = () => {
    setModals(modals.slice(0, -1));
  };

  const showLoading = (loading: boolean) => {
    setLoading(loading);
  };

  return (
    <ModalContext.Provider
      value={{ showModal, hideModal, showLoading, loading }}
    >
      {children}
      {modals.map((modal, index) => {
        const { Component, props } = modal;
        return <Component key={index} {...props} />;
      })}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
