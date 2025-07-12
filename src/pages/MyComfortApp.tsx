import React, { useState, useRef } from "react";
import ClientForm, { Client } from "../components/ClientForm";

// Icônes Lucide React
import {
  FileText, Users, Building, Plus, X, Eye, Save, Download, Trash2, Send,
  Cloud, Package, Edit3, Mail, Phone, AlertTriangle, ChevronDown, ShoppingCart, Minus, MapPin
} from 'lucide-react';

// Components
import HeaderNav from '../components/HeaderNav';
import StatusBar from '../components/StatusBar';
import ClientDropdown from '../components/ClientDropdown';
import InvoiceDropdown from '../components/InvoiceDropdown';
import { ProductForm } from '../components/ProductForm';
import ProductTable from '../components/ProductTable';
import TotalsBlock from '../components/TotalsBlock';
import SignaturePad from '../components/SignaturePad';
import { InvoicePreview } from '../components/InvoicePreview';

// Utils
import { 
  ClientInfo, 
  Invoice, 
  InvoiceItem, 
  mockClients, 
  mockInvoices,
  createNewInvoice,
  calculateTotals
} from '../utils/data';
